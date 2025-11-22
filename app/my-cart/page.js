"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image';
const CartPage = () => {
    const { data, status } = useSession();
    const [cartItems, setCartItems] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [limit, setlimit] = useState({})
    const [refresh, setrefresh] = useState(true)
    const [promoApplied, setPromoApplied] = useState(false);
    const loading = status === 'loading';
    // Calculate totals
    const subtotal = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const savings = cartItems?.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
    // const savings = 1
    const tax = (subtotal * 0.0875) // 8.75% tax
    const total = subtotal  + tax - discount;
    const router = useRouter()

    useEffect(() => {

    }, [])

    const updateQuantity = async (id, newQuantity, stock) => {
        setrefresh(pre => !pre)
        if (newQuantity <= 0) {
            // Prevent negative or zero quantities
            return;
        }
        if (newQuantity > stock) {
            // Set stock limit for specific item
            setlimit(prev => ({
                ...prev,
                [id]: true
            }));
            return;
        }

        setlimit(prev => ({
            ...prev,
            [id]: false
        }));


        try {
            const response = await fetch(`/api/cart/${data.user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    quantity: newQuantity,
                    id: id // <-- use 'id' consistently with backend
                })
            });
            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }

            // Optional: Handle response data if needed
            const updatedItem = await response.json();
            if (updatedItem.success) {

                setCartItems(items =>
                    items.map(item =>
                        item.id === id ? { ...item, quantity: newQuantity } : item
                    )
                );
            }
        } catch (error) {
            console.error('Error updating quantity:', error);

            // Revert local state if API call fails
            setCartItems(items =>
                items.map(item =>
                    item.id === id ? { ...item, quantity: item.quantity } : item
                )
            );
        }
    };
    useEffect(() => {
        if (status === "authenticated") {

            const getcartinfo = async () => {
                const cart = await fetch(`/api/cart/${data?.user.id}`)
                const response = await cart.json()
                // const useritems = response.filter("")
                setCartItems(response)
                console.log("cartitems", response)
            }

            getcartinfo()
        }

    }, [refresh, status])
    useEffect(() => {

        setrefresh(prev => !prev)


    }, [])

    const removeItem = async (productId, selectedVariant) => {
        console.log(productId, selectedVariant)
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                body: JSON.stringify({ productId, selectedVariant }),
            };

            const deleting = await fetch(`/api/cart/${data.user.id}`, requestOptions)
            toast.error("successfully deleted ", {
                position: "top-center",
            })
            setrefresh(prev => !prev)
            console.log(deleting)
        } catch (error) {
            toast.error("something wemt wrong ")
            console.error("error occured", error)
        }
    };

    const applyPromoCode = () => {
        const code = promoCode.toUpperCase();
        if (code === 'SAVE15') {
            setDiscount(subtotal * 0.15);
            setPromoApplied(true);
        } else if (code === 'NEWCUSTOMER25') {
            setDiscount(25);
            setPromoApplied(true);
        } else if (code === 'FREESHIP') {
            // setDiscount(shipping);
            setPromoApplied(true);
        }
    };

    const removePromo = () => {
        setDiscount(0);
        setPromoApplied(false);
        setPromoCode('');
    };
    const handleback = () => {
        router.back()
    }

    if (loading || !data || !data.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-gray-900 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <div className="font-bold text-lg text-gray-600">Loading your cart...</div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-lg mx-auto text-center bg-white rounded-2xl p-12 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Start adding items to your cart to see them here. Browse our collections to find something you love.
                        </p>
                        <button onClick={handleback} className="bg-gray-900 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (<>
        <ToastContainer />
        <div className="min-h-screen text-black bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={handleback} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Back to Shopping</span>
                        </button>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                        <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                    </div>
                    {savings > 0 && (
                        <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg font-medium">
                            You saved ${savings.toFixed(2)}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Cart Items */}
                    <div className="xl:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {cartItems.map((item, index) => (
                                <div key={item._id} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <div className="flex items-start gap-10">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-44 h-44 bg-gray-100 rounded-lg overflow-hidden shadow-md border border-gray-200">
                                                <Link href={`/product/${item.productId}`}>
                                                    {/* <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-colors cursor-pointer">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div> */}
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={176}
                                                        height={176}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-500 mb-1">{item.brand}</p>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.name}</h3>

                                                    {/* Specs Container */}
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {Object.entries(item.selectedVariant).map(([key, value]) => (
                                                            <div key={key} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-2 rounded-lg">
                                                                <span className="font-medium text-gray-700 capitalize text-sm">{key}:</span>
                                                                <span className="text-blue-600 font-semibold text-sm">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Stock Warning */}
                                                    {limit[item._id] && (
                                                        <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-amber-50 px-3 py-2 rounded-md border border-amber-100 mt-2 w-fit">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M6.228 6.228a9 9 0 1012.544 0M9 11h6m-6 4h6" />
                                                            </svg>
                                                            Only {item.stockCount} left in stock
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => removeItem(item.productId, item.selectedVariant)}
                                                    className="ml-4 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                    title="Remove from cart"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Bottom Controls */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <label className="text-sm font-medium text-gray-700">Qty:</label>
                                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.stockCount)}
                                                            className="p-2.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="px-4 py-2.5 font-medium min-w-[60px] text-center bg-gray-50">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.stockCount)}
                                                            className="p-2.5 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        ${(item.price).toFixed(2)}
                                                    </div>
                                                    {item.originalPrice > item.price && (
                                                        <div className="text-sm text-gray-500 line-through">
                                                            ${(item.originalPrice).toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promo Code Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h3>
                            {!promoApplied ? (
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="Enter promotional code"
                                        className="flex-1 text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        disabled={!promoCode.trim()}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 transition-colors font-medium"
                                    >
                                        Apply Code
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-green-800 font-medium">Promo code &quot;{promoCode}&quot; applied</span>
                                    </div>
                                    <button
                                        onClick={removePromo}
                                        className="text-green-600 hover:text-green-800 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Promotion Discount</span>
                                        <span className="font-medium">-${discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <button className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 mb-3">
                                    Proceed to Checkout
                                </button> </Link>

                            <button className="w-full text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-200">
                                Continue Shopping
                            </button>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    256-bit SSL encryption
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 mb-2">Accepted Payment Methods</p>
                                    <div className="flex justify-center space-x-3 text-gray-400">
                                        <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                                        <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">MC</div>
                                        <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">AMEX</div>
                                        <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">PP</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

    );
};

export default CartPage;