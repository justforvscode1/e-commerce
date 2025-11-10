"use client"
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CompletedOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const {data, status} = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            (async () => {
                try {
                    const orders = await fetch(`/api/order/${data.user.id}`);
                    const response = await orders.json();
                    setOrders(response);
                } catch (error) {
                    console.error('Error fetching completed orders:', error);
                    setOrders([]);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [status]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatShippingAddress = (shippingForm) => {
        return `${shippingForm.address}${shippingForm.apartment ? ', ' + shippingForm.apartment : ''}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}, ${shippingForm.country}`;
    };

    const getStatusBadge = (status) => {
        const styles = {
            delivered: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm',
            cancelled: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm',
            returned: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm',
            pending: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
        };
        return styles[status.toLowerCase()] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm';
    };

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.status.toLowerCase() === statusFilter;
    });

    const deliveredOrders = orders.filter(order => order.status.toLowerCase() === 'delivered');
    const cancelledOrders = orders.filter(order => order.status.toLowerCase() === 'cancelled');
    const totalValue = orders.reduce((sum, order) => sum + order.total, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-10">
                        <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg w-64 mb-4 animate-pulse"></div>
                        <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-96 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-32 mb-4"></div>
                                <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-48 mb-4"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-full mb-3"></div>
                                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header with subtle animation */}
                <div className="mb-10 opacity-0 animate-[fadeIn_0.6s_ease-out_0.1s_forwards]">
                    <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-3">
                        Order History
                    </h1>
                    <p className="text-base text-slate-600 font-light">
                        Track and manage all your purchases
                    </p>
                </div>

                {/* Elegant Filter Tabs */}
                <div className="mb-10 opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
                    <div className=" space-x-1 bg-slate-100/80 backdrop-blur-sm rounded-xl p-1.5 inline-flex">
                        {[
                            { key: 'all', label: 'All Orders', count: orders.length },
                            { key: 'delivered', label: 'Delivered', count: deliveredOrders.length },
                            { key: 'cancelled', label: 'Cancelled', count: cancelledOrders.length }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    statusFilter === tab.key
                                        ? 'bg-white text-slate-900 shadow-md transform scale-105'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                {tab.label}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                    statusFilter === tab.key 
                                        ? 'bg-slate-100 text-slate-700' 
                                        : 'bg-slate-200/50 text-slate-500'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Premium Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { 
                            label: 'Total Orders', 
                            value: orders.length,
                            gradient: 'from-slate-600 to-slate-800',
                            delay: '0.3s'
                        },
                        { 
                            label: 'Successfully Delivered', 
                            value: deliveredOrders.length,
                            gradient: 'from-emerald-600 to-teal-700',
                            delay: '0.4s'
                        },
                        { 
                            label: 'Total Lifetime Value', 
                            value: `$${totalValue.toFixed(2)}`,
                            gradient: 'from-blue-600 to-indigo-700',
                            delay: '0.5s'
                        }
                    ].map((stat, idx) => (
                        <div 
                            key={idx}
                            className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] group"
                            style={{ animationDelay: stat.delay }}
                        >
                            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 overflow-hidden group-hover:-translate-y-1">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                <div className="relative">
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                                        {stat.label}
                                    </p>
                                    <p className="text-4xl font-light text-slate-900 tracking-tight">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Orders List with staggered animation */}
                <div className="space-y-6">
                    {filteredOrders.map((order, index) => (
                        <div
                            key={order.orderId}
                            className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                        >
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-1">
                                {/* Order Header */}
                                <div
                                    className="p-8 cursor-pointer"
                                    onClick={() => toggleOrderExpansion(order.orderId)}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-4 mb-4">
                                                <h3 className="text-lg font-medium text-slate-900 tracking-tight">
                                                    #{order.orderId.substring(0, 8).toUpperCase()}
                                                </h3>
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)} transform transition-transform duration-300 group-hover:scale-105`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                <div className="group/item">
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order Date</p>
                                                    <p className="text-sm font-medium text-slate-900">{formatDate(order.createdat)}</p>
                                                </div>
                                                <div className="group/item">
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                                                    <p className="text-lg font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                                                </div>
                                                <div className="group/item">
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Items</p>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {order.orderedItems.length} {order.orderedItems.length === 1 ? 'product' : 'products'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="ml-6 text-slate-400 hover:text-slate-600 transition-colors duration-300">
                                            <svg
                                                className={`w-6 h-6 transition-transform duration-500 ${expandedOrder === order.orderId ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Quick Preview of Items */}
                                    {!expandedOrder || expandedOrder !== order.orderId ? (
                                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                            {order.orderedItems.slice(0, 4).map((item, idx) => (
                                                <div key={idx} className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex items-center justify-center border border-slate-200/50 transition-transform duration-300 hover:scale-110">
                                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                                    </svg>
                                                </div>
                                            ))}
                                            {order.orderedItems.length > 4 && (
                                                <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-medium text-slate-600">
                                                    +{order.orderedItems.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>

                                {/* Expanded Order Details */}
                                <div
                                    className={`transition-all duration-500 ease-in-out ${
                                        expandedOrder === order.orderId 
                                            ? 'max-h-[3000px] opacity-100' 
                                            : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                                        <div className="p-8">
                                            {/* Order Items */}
                                            <div className="mb-8">
                                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-6">Order Details</h4>
                                                <div className="space-y-4">
                                                    {order.orderedItems.map((item, idx) => (
                                                        <Link href={`/products/${item.id}`} key={item._id}>
                                                            <div className="flex items-center gap-6 p-5 bg-white rounded-xl border border-slate-200/50 hover:border-slate-300 hover:shadow-md transition-all duration-300 group/item">
                                                                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden flex-shrink-0 group-hover/item:scale-105 transition-transform duration-300">
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="text-base font-medium text-slate-900 mb-1 group-hover/item:text-slate-700 transition-colors">{item.name}</h5>
                                                                    <p className="text-sm text-slate-500 mb-2">{item.brand} • {item.category}</p>
                                                                    <div className="flex items-center gap-4 text-sm">
                                                                        <span className="text-slate-600">Qty: <span className="font-medium text-slate-900">{item.quantity}</span></span>
                                                                        <div className="flex items-center gap-1">
                                                                            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                            <span className="text-slate-600">{item.rating} <span className="text-slate-400">({item.reviewCount})</span></span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right flex-shrink-0">
                                                                    {item.originalPrice > item.price && (
                                                                        <p className="text-sm text-slate-400 line-through mb-1">${item.originalPrice.toFixed(2)}</p>
                                                                    )}
                                                                    <p className="text-lg font-semibold text-slate-900">${item.price.toFixed(2)}</p>
                                                                    <p className="text-sm text-slate-500 mt-1">
                                                                        ${(item.price * item.quantity).toFixed(2)} total
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200/50 shadow-sm">
                                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Payment Summary</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Subtotal</span>
                                                        <span className="font-medium text-slate-900">${order.subtotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Shipping</span>
                                                        <span className="font-medium text-slate-900">
                                                            {order.shippingCost === 0 ? <span className="text-emerald-600">Free</span> : `$${order.shippingCost.toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-600">Tax</span>
                                                        <span className="font-medium text-slate-900">${order.tax.toFixed(2)}</span>
                                                    </div>
                                                    <div className="pt-3 border-t border-slate-200 flex justify-between">
                                                        <span className="text-base font-semibold text-slate-900">Total</span>
                                                        <span className="text-xl font-bold text-slate-900">${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shipping & Payment Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                <div className="p-6 bg-white rounded-xl border border-slate-200/50 shadow-sm">
                                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Delivery Address</h4>
                                                    <div className="text-sm space-y-2">
                                                        <p className="font-medium text-slate-900 text-base">
                                                            {order.shippingForm.firstName} {order.shippingForm.lastName}
                                                        </p>
                                                        <p className="text-slate-600 leading-relaxed">{formatShippingAddress(order.shippingForm)}</p>
                                                        <div className="pt-3 space-y-1 border-t border-slate-100 mt-3">
                                                            <p className="text-slate-600">{order.shippingForm.phone}</p>
                                                            <p className="text-slate-600">{order.shippingForm.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-white rounded-xl border border-slate-200/50 shadow-sm">
                                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Order Information</h4>
                                                    <div className="text-sm space-y-3">
                                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                                            <span className="text-slate-600">Payment Method</span>
                                                            <span className="font-medium text-slate-900">{order.paymentMethod.toUpperCase()}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                                            <span className="text-slate-600">Shipping Method</span>
                                                            <span className="font-medium text-slate-900 capitalize">{order.shippingMethod}</span>
                                                        </div>
                                                        {order.completedAt && order.status.toLowerCase() !== 'pending' && (
                                                            <div className="flex items-center justify-between py-2">
                                                                <span className="text-slate-600">Completed On</span>
                                                                <span className="font-medium text-slate-900">{formatDate(order.completedAt)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3">
                                                {order.status.toLowerCase() === 'delivered' && (
                                                    <>
                                                        <button className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl hover:from-slate-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                                                            Reorder
                                                        </button>
                                                        <button className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-0.5">
                                                            Return Items
                                                        </button>
                                                    </>
                                                )}
                                                {order.status.toLowerCase() === 'cancelled' && (
                                                    <button className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl hover:from-slate-800 hover:to-black transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                                                        Reorder
                                                    </button>
                                                )}
                                                <button className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-0.5">
                                                    Download Invoice
                                                </button>
                                                <button className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-0.5">
                                                    Need Help?
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium Empty State */}
                {filteredOrders.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-light text-slate-900 mb-3">
                            {statusFilter === 'all' ? 'No orders yet' :
                                statusFilter === 'delivered' ? 'No delivered orders' :
                                    'No cancelled orders'}
                        </h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            {statusFilter === 'all' ? "Start your shopping journey with us today" :
                                statusFilter === 'delivered' ? "You don't have any delivered orders at the moment" :
                                    "You don't have any cancelled orders"}
                        </p>
                        <Link href="/shop">
                            <button className="px-8 py-4 text-sm font-medium text-white bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl hover:from-slate-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Explore Products
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
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
            `}</style>
        </div>
    );
}