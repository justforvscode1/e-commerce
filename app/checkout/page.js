"use client"
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PendingOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const { data, status } = useSession();

    useEffect(() => {
        const fetchOrders = async () => {
            if (status === "authenticated") {
                try {
                    setLoading(true);
                    setError(null);

                    const response = await fetch(`/api/order/${data.user.id}`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch orders');
                    }

                    const orderData = await response.json();
                    const pendingOrders = orderData.filter(item => item.status === "pending");
                    setOrders(pendingOrders);
                } catch (err) {
                    console.error('Error fetching orders:', err);
                    setError(err.message || 'Failed to load orders');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrders();
    }, [status, data?.user?.id]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatShippingAddress = (shippingForm) => {
        const parts = [
            shippingForm.address,
            shippingForm.apartment,
            shippingForm.city,
            `${shippingForm.state} ${shippingForm.zipCode}`
        ].filter(Boolean);
        return parts.join(', ');
    };

    const getEstimatedDelivery = (orderDate, shippingMethod) => {
        const daysMap = {
            standard: 7,
            express: 5,
            overnight: 1
        };
        const days = daysMap[shippingMethod] || 7;
        const date = new Date(orderDate);
        date.setDate(date.getDate() + days);
        return date.toISOString();
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8 space-y-3">
                        <div className="h-9 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                        <div className="h-12 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-xl mb-4 p-6 shadow-sm animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-3 flex-1">
                                    <div className="h-6 bg-gray-200 rounded w-40"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full max-w-2xl"></div>
                                </div>
                                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Orders</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Pending Orders</h1>
                    <Link href="/cancel">
                        <button className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg focus:ring-4 focus:ring-blue-500/50 focus:outline-none font-medium">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Manage Orders
                        </button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-500 rounded-xl shadow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-700 rounded-xl shadow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Value</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-green-100 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-500 rounded-xl shadow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Items</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {orders.reduce((sum, order) => sum + order.orderedItems.length, 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <div
                                key={order.orderId}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Order Header */}
                                <button
                                    className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-xl"
                                    onClick={() => toggleOrderExpansion(order.orderId)}
                                    aria-expanded={expandedOrder === order.orderId}
                                    aria-controls={`order-details-${order.orderId}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                                                    #{order.orderId.substring(0, 8).toUpperCase()}
                                                </h3>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 whitespace-nowrap">
                                                    {order.paymentMethod}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 whitespace-nowrap">
                                                    {order.shippingMethod}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-medium">Order Date:</span>
                                                    <span className="ml-1">{formatDate(order.createdAt)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Total:</span>
                                                    <span className="text-lg font-bold text-gray-900 ml-1">
                                                        ${order.total.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Est. Delivery:</span>
                                                    <span className="ml-1">
                                                        {formatDate(getEstimatedDelivery(order.createdAt, order.shippingMethod))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <svg
                                                className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedOrder === order.orderId ? 'rotate-180' : ''
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded Order Details */}
                                <div
                                    id={`order-details-${order.orderId}`}
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedOrder === order.orderId ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 border-t border-gray-100">
                                        {/* Order Summary */}
                                        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                            <div className="text-center">
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Subtotal</p>
                                                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                                                    ${order.subtotal.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Tax</p>
                                                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                                                    ${order.tax.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Shipping</p>
                                                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                                                    {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
                                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                                    ${order.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="mt-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                                Order Items ({order.orderedItems.length})
                                            </h4>
                                            <div className="space-y-3">
                                                {order.orderedItems.map((item) => (
                                                    <Link
                                                        href={`/products/${item.productId}`}
                                                        key={item._id}
                                                        className="block"
                                                    >
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
                                                            <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden">
                                                                <Image
                                                                    width={80}
                                                                    height={80}
                                                                    src={item.image || '/placeholder-product.png'}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    onError={(e) => {
                                                                        e.target.src = '/placeholder-product.png';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-medium text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                                                    {item.name}
                                                                </h5>
                                                                <p className="text-sm text-gray-600 mb-2 truncate">
                                                                    {item.brand} • {item.category}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mb-2">
                                                                    <span className="font-medium">Quantity:</span> {item.quantity}
                                                                </p>
                                                                {Object.keys(item.selectedVariant).length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                                        {Object.entries(item.selectedVariant).map(([key, value]) => (
                                                                            <span
                                                                                key={key}
                                                                                className="inline-flex items-center px-2 py-1 bg-white rounded text-xs border border-gray-200"
                                                                            >
                                                                                <span className="font-medium">{key}:</span>
                                                                                <span className="ml-1">{value}</span>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center">
                                                                    <div className="flex items-center">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <svg
                                                                                key={i}
                                                                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                                                                                    }`}
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-sm text-gray-600 ml-1">
                                                                        ({item.reviewCount || 0})
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-right flex-shrink-0 w-full sm:w-auto">
                                                                {item.originalPrice > item.price && (
                                                                    <p className="text-sm text-gray-400 line-through">
                                                                        ${item.originalPrice.toFixed(2)}
                                                                    </p>
                                                                )}
                                                                <p className="font-semibold text-gray-900 text-lg">
                                                                    ${item.price.toFixed(2)}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    Total: ${(item.price * item.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Customer & Shipping Info */}
                                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                                                    Customer Information
                                                </h4>
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg space-y-2 text-sm">
                                                    <p className="flex justify-between">
                                                        <span className="font-medium text-gray-700">Name:</span>
                                                        <span className="text-gray-900">
                                                            {order.shippingForm.firstName} {order.shippingForm.lastName}
                                                        </span>
                                                    </p>
                                                    <p className="flex justify-between break-all">
                                                        <span className="font-medium text-gray-700">Email:</span>
                                                        <span className="text-gray-900">{order.shippingForm.email}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="font-medium text-gray-700">Phone:</span>
                                                        <span className="text-gray-900">{order.shippingForm.phone}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="font-medium text-gray-700">Payment:</span>
                                                        <span className="text-gray-900 uppercase">{order.paymentMethod}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="font-medium text-gray-700">Shipping:</span>
                                                        <span className="text-gray-900 capitalize">{order.shippingMethod}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                                                    Shipping Address
                                                </h4>
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        {formatShippingAddress(order.shippingForm)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Orders</h3>
                        <p className="text-gray-600 mb-6">You don't have any pending orders at the moment.</p>
                        <Link href="/products">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Start Shopping
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out both;
                }
            `}</style>
        </div>
    );
}