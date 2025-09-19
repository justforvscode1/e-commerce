"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CompletedOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'delivered', 'cancelled'

    useEffect(() => {
        // Simulate API call for completed orders
        (async () => {
            try {
                const orders = await fetch("/api/order");
                const response = await orders.json();
                console.log(response);
                setOrders(response);
            } catch (error) {
                console.error('Error fetching completed orders:', error);
                // Fallback to empty array
                setOrders([]);
            } finally {
                setLoading(false);
            }
        })();
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

    // Helper function to convert cents to dollars
    const formatPrice = (priceInCents) => {
        return (priceInCents / 100).toFixed(2);
    };

    // Helper function to format shipping address
    const formatShippingAddress = (shippingForm) => {
        return `${shippingForm.address}${shippingForm.apartment ? ', ' + shippingForm.apartment : ''}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}, ${shippingForm.country}`;
    };

    // Helper function to get status color and icon
    const getStatusInfo = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                    )
                };
            case 'cancelled':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    )
                };
            case 'returned':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                    )
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                    )
                };
        }
    };

    // Filter orders based on status
    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.status.toLowerCase() === statusFilter;
    });

    // Calculate stats
    const deliveredOrders = orders.filter(order => order.status.toLowerCase() === 'delivered');
    const cancelledOrders = orders.filter(order => order.status.toLowerCase() === 'cancelled');
    const totalValue = orders.reduce((sum, order) => sum + order.total / 100, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Header Skeleton */}
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>

                    {/* Filter Skeleton */}
                    <div className="mb-6 flex space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                        ))}
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                                <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                        ))}
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Orders</h1>
                    <p className="text-gray-600">View your order history including delivered and cancelled orders</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-8">
                        {[
                            { key: 'all', label: 'All Orders', count: orders.length },
                            { key: 'delivered', label: 'Delivered', count: deliveredOrders.length },
                            { key: 'cancelled', label: 'Cancelled', count: cancelledOrders.length }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${statusFilter === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-green-600">Delivered Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{deliveredOrders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-red-600">Cancelled Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{cancelledOrders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-blue-600">Total Value</p>
                                <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.map((order, index) => {
                        const statusInfo = getStatusInfo(order.status);
                        return (

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
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                                    <span className="mr-2">{statusInfo.icon}</span>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>

                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    {order.paymentMethod}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {order.shippingMethod}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Order Date:</span> {formatDate(order.createdat)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Total:</span>
                                                    <span className="text-lg font-bold text-gray-900 ml-1">${formatPrice(order.total)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">

                                                        {order.status.toLowerCase()}
                                                    </span> <span className={`${order.status.toLowerCase() === "pending" ? "hidden" : "block"}`}>{formatDate(order.completedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <svg
                                                className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${expandedOrder === order.orderId ? 'rotate-180' : ''
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
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedOrder === order.orderId ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 border-t border-gray-100">
                                        {/* Order Summary */}
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Subtotal</p>
                                                <p className="text-lg font-semibold text-gray-900">${formatPrice(order.subtotal)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Tax</p>
                                                <p className="text-lg font-semibold text-gray-900">${formatPrice(order.tax)}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Shipping</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {order.shippingCost === 0 ? 'Free' : `$${formatPrice(order.shippingCost)}`}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">Total</p>
                                                <p className="text-xl font-bold text-gray-900">${formatPrice(order.total)}</p>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="mt-6">
                                            <h4 className="text-md font-semibold text-gray-900 mb-4">Order Items ({order.orderItems.length})</h4>
                                            <div className="space-y-3">
                                                {order.orderItems.map((item) => (
                                                    <Link href={`/products/${item.id}`} key={item._id}>
                                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                                <Image
                                                                    width={500}
                                                                    height={500}
                                                                    src={item.image[0]}
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
                                                                    {item.isNew && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            New
                                                                        </span>
                                                                    )}
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
                                                                    <p className="text-sm text-gray-400 line-through">${formatPrice(item.originalPrice)}</p>
                                                                )}
                                                                <p className="font-semibold text-gray-900">${formatPrice(item.price)}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    Total: ${formatPrice(item.price * item.quantity)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Customer & Shipping Info */}
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        <div className="mt-6 flex flex-wrap gap-3">
                                            {order.status.toLowerCase() === 'delivered' && (
                                                <>
                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                        Reorder Items
                                                    </button>
                                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                                                        Write Review
                                                    </button>
                                                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                                                        Return Items
                                                    </button>
                                                </>
                                            )}
                                            {order.status.toLowerCase() === 'cancelled' && (
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                    Reorder Items
                                                </button>
                                            )}
                                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                                Download Invoice
                                            </button>
                                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                                Contact Support
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {statusFilter === 'all' ? 'No completed orders' :
                                statusFilter === 'delivered' ? 'No delivered orders' :
                                    'No cancelled orders'}
                        </h3>
                        <p className="text-gray-600">
                            {statusFilter === 'all' ? "You don't have any completed orders yet." :
                                statusFilter === 'delivered' ? "You don't have any delivered orders yet." :
                                    "You don't have any cancelled orders."}
                        </p>
                        <Link href="/shop">
                            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-105">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                )}
            </div>


        </div>
    );
}