"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PendingOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);



    useEffect(() => {
        // Simulate API call
        (async () => {
            const orders = await fetch("/api/order")
            const response = await orders.json()
            const remain = response.filter(items => items.status === "pending" )
            setOrders(remain);
            setLoading(false);

        })()
    }, []);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to format shipping address
    const formatShippingAddress = (shippingForm) => {
        return `${shippingForm.address}${shippingForm.apartment ? ', ' + shippingForm.apartment : ''}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}, ${shippingForm.country}`;
    };

    // Helper function to calculate estimated delivery (7 days from order date)
    const getEstimatedDelivery = (orderDate, shippingMethod) => {
        let este;
        if (shippingMethod === "standard") {
            este = 7
        } else if (shippingMethod === "express") {
            este = 5

        } else {
            este = 1
        }
        const date = new Date(orderDate);
        date.setDate(date.getDate() + este);
        return date.toISOString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>

                    {/* Order Cards Skeleton */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl mb-4 p-6 animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-6 bg-gray-200 rounded w-32"></div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-36"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 transform transition-all duration-500 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Orders</h1>

                    {/* Add this new button */}
                    <Link href="/cancel">

                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">

                            Cancel / Track  your orders                         </button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-600">Pending Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-700 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Value</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-600">Items</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {orders.reduce((sum, order) => sum + order.orderItems.length, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <div
                            key={order.orderId}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transform transition-all duration-300 hover:scale-[1.02]"
                            style={{
                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                            }}
                        >
                            {/* Order Header */}
                            <div
                                className="p-6 cursor-pointer"
                                onClick={() => toggleOrderExpansion(order.orderId)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{order.orderId.substring(0, 8).toUpperCase()}</h3>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>

                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {order.paymentMethod}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                {order.shippingMethod}
                                            </span>

                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Order Date:</span> {formatDate(order.createdat)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Total:</span>
                                                <span className="text-lg font-bold text-gray-900 ml-1">${order.total.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Est. Delivery:</span> {formatDate(getEstimatedDelivery(order.createdat, order.shippingMethod))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <svg
                                            className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${expandedOrder === order.id ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Order Details */}
                            <div
                                className={` transition-all duration-300 ease-in-out ${expandedOrder === order.orderId ? 'h-auto opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-6 border-t border-gray-100">
                                    {/* Order Summary */}
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Subtotal</p>
                                            <p className="text-lg font-semibold text-gray-900">${order.subtotal}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Tax</p>
                                            <p className="text-lg font-semibold text-gray-900">${order.tax.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Shipping</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost}`}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">Total</p>
                                            <p className="text-xl font-bold text-gray-900">${order.total}</p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="mt-6">
                                        <h4 className="text-md font-semibold text-gray-900 mb-4">Order Items ({order.orderItems.length})</h4>
                                        <div className="space-y-3">
                                            {order.orderItems.map((item) => (
                                                <Link href={`/products/${item.id}`} key={item._id}> <div

                                                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    <div className="w-20 h-20 bg-white rounded-lg  border border-gray-200 flex-shrink-0">
                                                        <Image
                                                            width={500}
                                                            height={500}
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextElementSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg hidden items-center justify-center">
                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h5 className="font-medium text-gray-900">{item.name}</h5>

                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-1">{item.brand} • {item.category}</p>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                        <div className="flex items-center mt-1">
                                                            <div className="flex items-center text-yellow-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-gray-600 ml-1">({item.reviewCount})</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        {item.originalPrice > item.price && (
                                                            <p className="text-sm text-gray-400 line-through">${item.originalPrice}</p>
                                                        )}
                                                        <p className="font-semibold text-gray-900">${item.price}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Total: ${item.price * item.quantity}
                                                        </p>
                                                    </div>
                                                </div></Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customer & Shipping Info */}
                                    <div className="mt-6 grid  grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                                <p><span className="font-medium">Name:</span> {order.shippingForm.firstName} {order.shippingForm.lastName}</p>
                                                <p><span className="font-medium">Email:</span> {order.shippingForm.email}</p>
                                                <p><span className="font-medium">Phone:</span> {order.shippingForm.phone}</p>
                                                <p><span className="font-medium">Payment:</span> {order.paymentMethod.toUpperCase()}</p>
                                                <p><span className="font-medium">Shipping:</span> {order.shippingMethod} shipping</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-900 mb-3">Shipping Address</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg text-sm">
                                                <p className="text-gray-700">{formatShippingAddress(order.shippingForm)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {orders.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending orders</h3>
                        <p className="text-gray-600">You don&lsquo;t have any pending orders at the moment.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
        </div>
    );
}