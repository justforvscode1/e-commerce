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
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const { data, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            (async () => {
                try {
                    const orders = await fetch(`/api/order/${data.user.id}`);
                    const response = await orders.json();
                    setOrders(response);
                    console.log('Fetched completed orders:', response);
                } catch (error) {
                    console.error('Error fetching completed orders:', error);
                    setOrders([]);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [status , data]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    const handleFilterSelect = (filter) => {
        setStatusFilter(filter);
        setShowFilterDropdown(false); // ✅ FIXED: Close dropdown after selection
        console.log("Selected filter:", filter);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatShippingAddress = (shippingForm) => {
        return `${shippingForm.address}${shippingForm.apartment ? ', ' + shippingForm.apartment : ''}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}`;
    };

    const getStatusBadge = (status) => {
        const styles = {
            delivered: 'bg-green-100 text-green-800 border border-green-200',
            cancelled: 'bg-red-100 text-red-800 border border-red-200',
            returned: 'bg-amber-100 text-amber-800 border border-amber-200',
            pending: 'bg-amber-100 text-amber-800 border border-amber-200'
        };
        return styles[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    const getFilterLabel = (filter) => {
        const labels = {
            all: 'All Orders',
            pending: 'Pending',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            returned: 'Returned'
        };
        return labels[filter] || 'All Orders';
    };

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.status.toLowerCase() === statusFilter;
    });

    const deliveredOrders = orders.filter(order => order.status.toLowerCase() === 'delivered');
    const cancelledOrders = orders.filter(order => order.status.toLowerCase() === 'cancelled');
    const pendingOrders = orders.filter(order => order.status.toLowerCase() === 'pending');
    const returnedOrders = orders.filter(order => order.status.toLowerCase() === 'returned');

    // Calculate stats based on current filter
    const getFilteredStats = () => {
        switch (statusFilter) {
            case 'pending':
                return {
                    totalOrders: pendingOrders.length,
                    totalValue: pendingOrders.reduce((sum, order) => sum + order.total, 0),
                    averageOrder: pendingOrders.length ? (pendingOrders.reduce((sum, order) => sum + order.total, 0) / pendingOrders.length).toFixed(2) : 0,
                    totalItems: pendingOrders.reduce((sum, order) => sum + order.orderedItems.length, 0)
                };
            case 'delivered':
                return {
                    totalOrders: deliveredOrders.length,
                    totalValue: deliveredOrders.reduce((sum, order) => sum + order.total, 0),
                    averageOrder: deliveredOrders.length ? (deliveredOrders.reduce((sum, order) => sum + order.total, 0) / deliveredOrders.length).toFixed(2) : 0,
                    totalItems: deliveredOrders.reduce((sum, order) => sum + order.orderedItems.length, 0)
                };
            case 'cancelled':
                return {
                    totalOrders: cancelledOrders.length,
                    totalValue: cancelledOrders.reduce((sum, order) => sum + order.total, 0),
                    averageOrder: cancelledOrders.length ? (cancelledOrders.reduce((sum, order) => sum + order.total, 0) / cancelledOrders.length).toFixed(2) : 0,
                    totalItems: cancelledOrders.reduce((sum, order) => sum + order.orderedItems.length, 0)
                };
            case 'returned':
                return {
                    totalOrders: returnedOrders.length,
                    totalValue: returnedOrders.reduce((sum, order) => sum + order.total, 0),
                    averageOrder: returnedOrders.length ? (returnedOrders.reduce((sum, order) => sum + order.total, 0) / returnedOrders.length).toFixed(2) : 0,
                    totalItems: returnedOrders.reduce((sum, order) => sum + order.orderedItems.length, 0)
                };
            default: // all
                return {
                    totalOrders: orders.length,
                    totalValue: orders.reduce((sum, order) => sum + order.total, 0),
                    averageOrder: orders.length ? (orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toFixed(2) : 0,
                    totalItems: orders.reduce((sum, order) => sum + order.orderedItems.length, 0)
                };
        }
    };

    const stats = getFilteredStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (<>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
                            <p className="text-xs text-gray-500">Manage your orders and account</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}
                        <Link href="/dashboard/profile" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:shadow-lg transition-shadow">
                                {data?.user?.name ? data.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                {/* Header */}
                <div className="mb-10 opacity-0 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight animate-slideDown">
                                Your All Orders
                                <span className="block w-20 h-1 bg-[#155dfc] mt-3 rounded-full"></span>
                            </h1>
                            <p className="text-gray-600 animate-slideUp">Track and manage all your purchases</p>
                        </div>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                </div>

                {/* Filter Section */}
                <div className="mb-10 opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    {/* Mobile Filter Dropdown - FIXED VERSION */}
                    <div className="md:hidden relative z-50">
                        <button
                            onClick={toggleFilterDropdown}
                            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-center">
                                <span className="text-gray-700 font-medium">{getFilterLabel(statusFilter)}</span>
                                <span className="ml-2 text-xs px-2 py-1 bg-[#155dfc] text-white rounded-full">
                                    {filteredOrders.length}
                                </span>
                            </div>
                            <svg
                                className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${showFilterDropdown ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <div
                            role="listbox"
                            aria-label="Order status filter"
                            className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 transition-all duration-300 transform origin-top ${showFilterDropdown
                                ? 'opacity-100 scale-100 translate-y-0'
                                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                }`}
                        >
                            {[
                                { key: 'all', label: 'All Orders', count: orders.length },
                                { key: 'pending', label: 'Pending', count: pendingOrders.length },
                                { key: 'delivered', label: 'Delivered', count: deliveredOrders.length },
                                { key: 'cancelled', label: 'Cancelled', count: cancelledOrders.length },
                                { key: 'returned', label: 'Returned', count: returnedOrders.length }
                            ].map((tab, index) => (
                                <button
                                    key={tab.key}
                                    role="option"
                                    aria-selected={statusFilter === tab.key}
                                    onClick={() => handleFilterSelect(tab.key)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 ${statusFilter === tab.key
                                        ? 'bg-blue-50 text-[#155dfc]'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
                                >
                                    <span className="font-medium">{tab.label}</span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${statusFilter === tab.key
                                            ? 'bg-[#155dfc] text-white'
                                            : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Filter Tabs - Only show on desktop */}
                    <div className="hidden md:flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1">
                        {[
                            { key: 'all', label: 'All Orders', count: orders.length },
                            { key: 'pending', label: 'Pending', count: pendingOrders.length },
                            { key: 'delivered', label: 'Delivered', count: deliveredOrders.length },
                            { key: 'cancelled', label: 'Cancelled', count: cancelledOrders.length },
                            { key: 'returned', label: 'Returned', count: returnedOrders.length }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center ${statusFilter === tab.key
                                    ? 'bg-[#155dfc] text-white shadow-sm transform scale-105'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${statusFilter === tab.key
                                    ? 'bg-blue-100 text-[#155dfc]'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Cards - Show relevant stats based on current filter */}
                <div className={`${showFilterDropdown ? "opacity-0 pointer-events-none" : "block"}  grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 relative z-10`}>
                    {[
                        {
                            label: 'Total Orders',
                            value: stats.totalOrders,
                            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
                            delay: '0.3s'
                        },
                        {
                            label: 'Total Items',
                            value: stats.totalItems,
                            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10',
                            delay: '0.4s'
                        },
                        {
                            label: 'Total Value',
                            value: `$${stats.totalValue.toFixed(2)}`,
                            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
                            delay: '0.5s'
                        },
                        {
                            label: 'Avg Order',
                            value: `$${stats.averageOrder}`,
                            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                            delay: '0.6s'
                        }
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 opacity-0 animate-slideUp"
                            style={{ animationDelay: stat.delay, animationFillMode: 'forwards' }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{stat.label}</p>
                                    <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className="p-2 md:p-3 bg-blue-50 rounded-lg transform transition-transform duration-300 hover:scale-110">
                                    <svg className="w-4 h-4 md:w-6 md:h-6 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={stat.icon} />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4 relative z-0">
                    {filteredOrders.map((order, index) => (
                        <div
                            key={order.orderId}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 opacity-0 animate-slideUp"
                            style={{
                                animationDelay: `${0.7 + index * 0.1}s`,
                                animationFillMode: 'forwards'
                            }}
                        >
                            {/* Order Header */}
                            <div
                                className="p-4 md:p-6 cursor-pointer hover:bg-blue-50 transition-all duration-300 border-l-4 border-[#155dfc]"
                                onClick={() => toggleOrderExpansion(order.orderId)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-wide">
                                                #{order.orderId.substring(0, 8).toUpperCase()}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)} uppercase tracking-wider`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <svg className="w-4 h-4 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">Total:</span>
                                                <span className="text-lg font-bold text-gray-900">${order.total?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <span>Items: {order.orderedItems?.length || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-2 md:ml-4">
                                        <svg
                                            className={`w-5 h-5 text-[#155dfc] transform transition-transform duration-300 ${expandedOrder === order.orderId ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Order Details */}
                            <div
                                className={`transition-all duration-500 overflow-hidden ${expandedOrder === order.orderId
                                    ? 'max-h-[2000px] opacity-100'
                                    : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-4 md:px-6 pb-6 border-t border-gray-200">
                                    {/* Order Items */}
                                    <div className="mt-6">
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                            <span>Order Items ({order.orderedItems?.length || 0})</span>
                                            <span className="w-2 h-2 bg-[#155dfc] rounded-full animate-pulse"></span>
                                        </h4>
                                        <div className="space-y-3">
                                            {order.orderedItems?.map((item, itemIndex) => (
                                                <div key={item._id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5">
                                                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-blue-100 transform transition-transform duration-300 hover:scale-105">
                                                        {/* <svg className="w-6 h-6 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                                            </svg> */}
                                                        <Link href={`/product/${item.productId}`} >
                                                            <Image src={item.image} alt={item.name} width={60} height={60} className="w-16 h-16 object-contain rounded-md" />
                                                        </Link>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h5>
                                                        <p className="text-sm text-gray-600 mb-2 truncate">{item.brand} • {item.category}</p>
                                                        <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                                                        <div className="flex items-center">
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg
                                                                        key={i}
                                                                        className={`w-3 h-3 ${i < Math.floor(item.rating || 0)
                                                                            ? 'text-amber-500'
                                                                            : 'text-gray-300'
                                                                            }`}
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-gray-600 ml-2">({item.reviewCount || 0})</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        {item.originalPrice > item.price && (
                                                            <p className="text-sm text-gray-400 line-through">${item.originalPrice?.toFixed(2)}</p>
                                                        )}
                                                        <p className="font-bold text-gray-900">${item.price?.toFixed(2)}</p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                        </p>

                                                        {/* Action buttons for delivered items */}
                                                        {order.status.toLowerCase() === 'delivered' && (
                                                            <div className="mt-3 flex flex-col gap-2">
                                                                <Link href={`/review-order/${item.productId}`}
                                                                    className="w-full px-2 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-200">
                                                                    Give Review

                                                                </Link>
                                                                <button className="w-full px-2 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors border border-red-200">
                                                                    Return Item
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="text-center transform transition-transform duration-300 hover:scale-105">
                                            <p className="text-xs text-[#155dfc] uppercase tracking-wide mb-1 font-semibold">Subtotal</p>
                                            <p className="text-base md:text-lg font-bold text-gray-900">${order.subtotal?.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center transform transition-transform duration-300 hover:scale-105">
                                            <p className="text-xs text-[#155dfc] uppercase tracking-wide mb-1 font-semibold">Tax</p>
                                            <p className="text-base md:text-lg font-bold text-gray-900">${order.tax?.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center transform transition-transform duration-300 hover:scale-105">
                                            <p className="text-xs text-[#155dfc] uppercase tracking-wide mb-1 font-semibold">Shipping</p>
                                            <p className="text-base md:text-lg font-bold text-gray-900">
                                                {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost}`}
                                            </p>
                                        </div>
                                        <div className="text-center transform transition-transform duration-300 hover:scale-105">
                                            <p className="text-xs text-[#155dfc] uppercase tracking-wide mb-1 font-semibold">Total</p>
                                            <p className="text-lg md:text-xl font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Customer & Shipping Info */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Customer Information</h4>
                                            <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100 space-y-2 text-sm">
                                                <div className="flex items-start">
                                                    <span className="text-[#155dfc] w-16 font-semibold">Name:</span>
                                                    <span className="text-gray-900">{order.shippingForm?.firstName} {order.shippingForm?.lastName}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-[#155dfc] w-16 font-semibold">Email:</span>
                                                    <span className="text-gray-900">{order.shippingForm?.email}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-[#155dfc] w-16 font-semibold">Phone:</span>
                                                    <span className="text-gray-900">{order.shippingForm?.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Shipping Address</h4>
                                            <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100 text-sm">
                                                <p className="text-gray-700 leading-relaxed">{formatShippingAddress(order.shippingForm)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {order.status.toLowerCase() === 'delivered' && (
                                            <>

                                                <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 text-sm">
                                                    Return Items
                                                </button>
                                            </>
                                        )}

                                        {order.status.toLowerCase() === 'pending' && (
                                            <button className="px-4 py-2 bg-[#155dfc] text-white rounded-lg hover:bg-[#124fd0] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                                                Track Order
                                            </button>
                                        )}
                                        {order.status.toLowerCase() === 'returned' && (
                                            <button className="px-4 py-2 bg-[#155dfc] text-white rounded-lg hover:bg-[#124fd0] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                                                Buy Again
                                            </button>
                                        )}
                                        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 text-sm">
                                            Download Invoice
                                        </button>
                                        <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 text-sm">
                                            Need Help?
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && !loading && (
                    <div className="text-center py-12 md:py-16 bg-white rounded-lg border border-gray-200 shadow-sm transform hover:scale-105 transition-transform duration-300 relative z-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-blue-50 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                            <svg className="w-8 h-8 md:w-10 md:h-10 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                            {statusFilter === 'all' ? 'No orders yet' :
                                statusFilter === 'pending' ? 'No pending orders' :
                                    statusFilter === 'delivered' ? 'No delivered orders' :
                                        statusFilter === 'cancelled' ? 'No cancelled orders' :
                                            'No returned orders'}
                        </h3>
                        <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                            {statusFilter === 'all' ? "Start your shopping journey with us today" :
                                statusFilter === 'pending' ? "You don't have any pending orders at the moment" :
                                    statusFilter === 'delivered' ? "You don't have any delivered orders at the moment" :
                                        statusFilter === 'cancelled' ? "You don't have any cancelled orders" :
                                            "You don't have any returned orders"}
                        </p>

                    </div>
                )}
            </div>

            {/* Close dropdown when clicking outside - High z-index */}
            {showFilterDropdown && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setShowFilterDropdown(false)}
                />
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                
                .animate-slideUp {
                    animation: slideUp 0.8s ease-out forwards;
                }

                .animate-slideDown {
                    animation: slideDown 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    </>
    );
}