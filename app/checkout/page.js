"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/paymentForm';
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [pendingOrderId, setPendingOrderId] = useState(null);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const { data, status } = useSession()
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [newsletterSubscribe, setNewsletterSubscribe] = useState(false);
    const [orderItems, setorderitems] = useState([])
    const [errorhandle, seterrorhandle] = useState(false)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const router = useRouter()
    const [shippingForm, setShippingForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
    });
    useEffect(() => {
        if (status === "authenticated" && data) {
            const getcartitems = async () => {
                const response = await fetch(`/api/cart/${data.user.id}`)
                const cartData = await response.json()
                // Remove userId from each item
                const cleanedItems = cartData.map(({ userId, stockCount, ...item }) => item)
                setorderitems(cleanedItems)
                console.log(cleanedItems)
            }
            getcartitems()
        }
    }, [status])

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingMethod === 'express' ? 24.99 : shippingMethod === 'overnight' ? 49.99 : 0;
    const tax = subtotal * 0.0875;
    const total = subtotal + shippingCost + tax;

    const handleShippingChange = (field, value) => {
        setShippingForm(prev => ({ ...prev, [field]: value }));
    };

    const handleback = () => {
        router.back()
    }

    const generateOrderId = () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return `ORD-${timestamp}-${random}`.toUpperCase();
    };

    const createOrderInDatabase = async (orderId, paymentStatus) => {
        const orderedItems = orderItems.map(({ _id, ...item }) => item)
        const finaldata = {
            orderId,
            orderedItems: orderedItems,
            paymentMethod,
            paymentStatus,
            status: 'pending',
            shippingForm,
            shippingMethod,
            shippingCost,
            subtotal,
            tax,
            total,
        };

        try {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            const sendcheckout = await fetch(`/api/order/${data.user.id}`, {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(finaldata),
            });

            const response = await sendcheckout.json();
            console.log('createOrder response', response);

            if (!sendcheckout.ok) {
                return { ok: false, error: response?.error || 'Failed to create order' };
            }

            // On successful order creation, clear user's cart
            const myHeader = new Headers();
            myHeader.append('Content-Type', 'application/json');
            const requestOptions = {
                method: 'DELETE',
                headers: myHeader,
                body: JSON.stringify({ userId: data.user.id }),
            };

            const check = await fetch(`/api/cart/${data.user.id}`, requestOptions);
            const responses = await check.json();
            console.log('clearCart response', responses);

            if (!check.ok) {
                return { ok: false, error: responses?.error || 'Order created but failed to clear cart' };
            }

            return { ok: true, data: response };
        } catch (err) {
            console.error('createOrderInDatabase error', err);
            return { ok: false, error: err?.message || String(err) };
        }
    };

    // Return orderId string to proceed to payment, or false to abort
    const handlePlaceOrder = async () => {
        console.log("placing order")
        try {
            const isEmptyField = Object.values(shippingForm).some(field =>
                field.trim() === ''
            );

            if (isEmptyField) {
                seterrorhandle(true)
                return false;
            }

            // Validation passed
            seterrorhandle(false)
            setAgreedToTerms(false)

            // If COD, create order immediately with pending payment status and do NOT proceed to payment
            if (paymentMethod === 'cod') {
                const orderId = generateOrderId();
                await createOrderInDatabase(orderId, 'pending');
                toast.success('Your order has been placed ', { position: 'top-center' });
                setTimeout(() => {

                    router.replace('/dashboard');
                }, 1000);
                return false;
            }

            // If online payment, generate and return orderId so payment form can proceed
            if (paymentMethod === 'card') {
                const orderId = generateOrderId();
                setPendingOrderId(orderId);
                // set processing flag - actual DB create happens after payment success
                setIsProcessingPayment(true);
                return orderId;
            }

            // default: do not proceed
            return false;
        } catch (error) {
            console.log(error)
            toast.error("error placing your order", {
                position: "top-center"
            })
            setIsProcessingPayment(false);
            return false;
        }
    };

    // Called when Stripe payment succeeds. `orderIdFromForm` is the id we generated before payment.
    const handleStripePaymentSuccess = async (paymentIntentId, orderIdFromForm) => {
        try {
            const orderId = orderIdFromForm || pendingOrderId || generateOrderId();
            const result = await createOrderInDatabase(orderId, 'paid');
            if (result.ok) {
                toast.success('Your order has been placed', { position: 'top-center' });
                // clear pending order id and processing flag
                setPendingOrderId(null);
                setIsProcessingPayment(false);
                router.replace('/dashboard');
            } else {
                console.error('Order created fail:', result);
                toast.error(result.error || 'Order creation failed after payment', { position: 'top-center' });
                setIsProcessingPayment(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error completing order after payment', { position: 'top-center' });
            setIsProcessingPayment(false);
        }
    };

    const handleStripePaymentError = (errorMessage) => {
        toast.error(errorMessage, {
            position: "top-center"
        });
        console.log(errorMessage);
        setIsProcessingPayment(false);
    };

    return (<>
        <div className="min-h-screen text-black bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={handleback} className="text-gray-600 flex items-center hover:text-gray-900 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <h1 className="text-2xl font-bold text-gray-900">Back</h1>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            </svg>
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Forms */}
                    <div className="space-y-8">
                        {/* Shipping Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                    1
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        value={shippingForm.firstName}
                                        onChange={(e) => handleShippingChange('firstName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        value={shippingForm.lastName}
                                        onChange={(e) => handleShippingChange('lastName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={shippingForm.email}
                                        onChange={(e) => handleShippingChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={shippingForm.phone}
                                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                <input
                                    type="text"
                                    value={shippingForm.address}
                                    onChange={(e) => handleShippingChange('address', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apartment, suite, etc. (Optional)</label>
                                <input
                                    type="text"
                                    value={shippingForm.apartment}
                                    onChange={(e) => handleShippingChange('apartment', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        value={shippingForm.city}
                                        onChange={(e) => handleShippingChange('city', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <select
                                        value={shippingForm.state}
                                        onChange={(e) => handleShippingChange('state', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Select State</option>
                                        <option value="CA">California</option>
                                        <option value="NY">New York</option>
                                        <option value="TX">Texas</option>
                                        <option value="FL">Florida</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                                    <input
                                        type="text"
                                        value={shippingForm.zipCode}
                                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`text-center text-red-500 ${errorhandle ? "block" : "hidden"}`} >fill all the inputs</div>
                        </div>

                        {/* Shipping Method */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                    2
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Shipping Method</h2>
                            </div>

                            <div className="space-y-4">
                                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
                                    onClick={() => setShippingMethod('standard')}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                checked={shippingMethod === 'standard'}
                                                onChange={() => setShippingMethod('standard')}
                                                className="mr-3"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">Standard Shipping</p>
                                                <p className="text-sm text-gray-600">5-7 business days</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>
                                </div>

                                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
                                    onClick={() => setShippingMethod('express')}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                checked={shippingMethod === 'express'}
                                                onChange={() => setShippingMethod('express')}
                                                className="mr-3"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">Express Shipping</p>
                                                <p className="text-sm text-gray-600">2-3 business days</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold">$24.99</span>
                                    </div>
                                </div>

                                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${shippingMethod === 'overnight' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
                                    onClick={() => setShippingMethod('overnight')}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                checked={shippingMethod === 'overnight'}
                                                onChange={() => setShippingMethod('overnight')}
                                                className="mr-3"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">Overnight Shipping</p>
                                                <p className="text-sm text-gray-600">1 business day</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold">$49.99</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                    3
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
                                    onClick={() => setPaymentMethod('card')}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                            className="mr-3"
                                        />
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">Credit/Debit Card</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}
                                    onClick={() => setPaymentMethod('cod')}>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                            className="mr-3"
                                        />
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="font-semibold text-gray-900">Cash on Delivery</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 ml-8">Pay with cash when your order is delivered</p>
                                </div>
                            </div>

                            {/* Stripe Payment Form */}


                            {/* COD Notice */}
                            {paymentMethod === 'cod' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800">Cash on Delivery Selected</p>
                                            <p className="text-xs text-yellow-700">Please have exact cash ready for payment upon delivery</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:sticky lg:top-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>

                            {/* Order Items */}
                            <div className="space-y-4 mb-6">
                                {orderItems.map((item) => (
                                    <div key={item._id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-500">{item.brand}</p>
                                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Totals */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {shippingCost === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `${shippingCost.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            {paymentMethod === 'card' ? (
                                <Elements stripe={stripePromise}>
                                    <PaymentForm
                                        orderId={pendingOrderId}
                                        amount={total}
                                        email={shippingForm.email}
                                        onSuccess={handleStripePaymentSuccess}
                                        onError={handleStripePaymentError}
                                        isProcessing={isProcessingPayment}
                                        agreedToTerms={agreedToTerms}
                                        handlePlaceOrder={handlePlaceOrder}
                                        createOrderInDatabase={createOrderInDatabase}
                                    />
                                </Elements>
                            ) : (<button
                                onClick={handlePlaceOrder}
                                disabled={!agreedToTerms || isProcessingPayment}
                                className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 mb-4"
                            >
                                {paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ${total.toFixed(2)}`}
                            </button>)}

                            {/* Security Info */}
                            <div className="text-center">
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    256-bit SSL encryption
                                </div>
                                <p className="text-xs text-gray-400">
                                    Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                            <div className="space-y-4">
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 mr-3"
                                        required
                                    />
                                    <span className="text-sm text-gray-700">
                                        I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> *
                                    </span>
                                </label>

                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={newsletterSubscribe}
                                        onChange={(e) => setNewsletterSubscribe(e.target.checked)}
                                        className="mt-1 mr-3"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Subscribe to our newsletter for exclusive offers and updates
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
};

export default CheckoutPage;