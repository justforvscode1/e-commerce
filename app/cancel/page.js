"use client"
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function UserOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'assigned', 'out_for_delivery', 'delivered', 'cancelled'
  const [cancelModal, setCancelModal] = useState({ show: false, orderId: null });
  const [userInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123'
  });

  // Mock function to simulate API call - replace with actual user orders API
  const fetchUserOrders = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
   const getthedata= await fetch("/api/order")
   const data= await getthedata.json()
    return data;
  };

  useEffect(() => {
    const loadUserOrders = async () => {
      try {
        // Replace with: const response = await fetch("/api/user/orders")
        const apidata = await fetchUserOrders();
        setOrders(apidata);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserOrders();
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (priceInCents) => {
    return (priceInCents / 100).toFixed(2);
  };

  const formatShippingAddress = (shippingForm) => {
    return `${shippingForm.address}${shippingForm.apartment ? ', ' + shippingForm.apartment : ''}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}`;
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        ),
        label: 'Order Placed'
      },
      assigned: {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        ),
        label: 'Being Prepared'
      },
      out_for_delivery: {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
          </svg>
        ),
        label: 'Out for Delivery'
      },
      delivered: {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ),
        label: 'Delivered'
      },
      cancelled: {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ),
        label: 'Cancelled'
      }
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'high') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
          High Priority
        </span>
      );
    }
    return null;
  };

  const canCancelOrder = (status) => {
    return ['pending', 'assigned'].includes(status);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch('/api/order', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          status: 'cancelled'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel order');
      }

      if (data.success) {        
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? {
                ...order,
                status: 'cancelled',
                cancelledat: new Date().toISOString()
              }
              : order
          )
        );
      }
      
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order: ' + error.message);
    }
    
    setCancelModal({ show: false, orderId: null });
  };

  const openCancelModal = (orderId) => {
    setCancelModal({ show: true, orderId });
  };

  const getOrderStatusProgress = (status, createdAt, assignedAt, pickedAt, deliveredAt, cancelledAt) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', date: createdAt, active: true },
      { key: 'assigned', label: 'Being Prepared', date: assignedAt, active: ['assigned', 'out_for_delivery', 'delivered'].includes(status) },
      { key: 'out_for_delivery', label: 'Out for Delivery', date: pickedAt, active: ['out_for_delivery', 'delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', date: deliveredAt, active: status === 'delivered' }
    ];

    if (status === 'cancelled') {
      return [
        { key: 'placed', label: 'Order Placed', date: createdAt, active: true },
        { key: 'cancelled', label: 'Order Cancelled', date: cancelledAt, active: true, cancelled: true }
      ];
    }

    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 mb-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{userInfo.name}</h3>
                  <p className="text-sm text-gray-600">{userInfo.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{userInfo.phone}</span>
                </div>
              </div>
            </div>

            {/* Order Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Orders</span>
                  <span className="font-semibold text-blue-600">{orders.filter(o => ['pending', 'assigned', 'out_for_delivery'].includes(o.status)).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivered</span>
                  <span className="font-semibold text-green-600">{orders.filter(o => o.status === 'delivered').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-semibold text-red-600">{orders.filter(o => o.status === 'cancelled').length}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-gray-900">Total Orders</span>
                    <span className="text-gray-900">{orders.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                { key: 'assigned', label: 'Being Prepared', count: orders.filter(o => o.status === 'assigned').length },
                { key: 'out_for_delivery', label: 'Out for Delivery', count: orders.filter(o => o.status === 'out_for_delivery').length },
                { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
                { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${statusFilter === filter.key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const statusBadge = getStatusBadge(order.status);
                const priorityBadge = getPriorityBadge(order.priority);
                const progressSteps = getOrderStatusProgress(order.status, order.createdat, order.assignedat, order.pickedat, order.deliveredat, order.cancelledat);

                return (
                  <div
                    key={order.orderId}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transform transition-all duration-300"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.orderId.substring(0, 8).toUpperCase()}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}>
                              {statusBadge.icon}
                              {statusBadge.label}
                            </span>
                            {priorityBadge}
                            {order.paymentMethod === 'cod' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Cash on Delivery
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium">Order Date:</span><br />
                              {formatDate(order.createdat)}
                            </div>
                            <div>
                              <span className="font-medium">Items:</span><br />
                              {order.orderItems.length} item(s)
                            </div>
                            <div>
                              <span className="font-medium">Total:</span><br />
                              ${formatPrice(order.total)}
                            </div>
                            <div>
                              <span className="font-medium">Expected Delivery:</span><br />
                              {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'TBD'}
                            </div>
                          </div>

                          {/* Delivery Address */}
                          <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                <p className="font-medium text-gray-900">Delivery Address:</p>
                                <p className="text-gray-700">{formatShippingAddress(order.shippingForm)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Progress */}
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h5 className="font-medium text-gray-900 mb-3">Order Progress</h5>
                            <div className="relative">
                              {progressSteps.map((step, stepIndex) => (
                                <div key={step.key} className="flex items-center mb-3 last:mb-0">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${step.active 
                                      ? step.cancelled 
                                        ? 'bg-red-500' 
                                        : 'bg-blue-500'
                                      : 'bg-gray-300'
                                    }`}>
                                    {step.active && (
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                        <circle cx="4" cy="4" r="3"/>
                                      </svg>
                                    )}
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <p className={`text-sm font-medium ${step.active ? step.cancelled ? 'text-red-700' : 'text-gray-900' : 'text-gray-500'}`}>
                                      {step.label}
                                    </p>
                                    {step.date && (
                                      <p className="text-xs text-gray-500">
                                        {formatDate(step.date)} {formatTime(step.date)}
                                      </p>
                                    )}
                                  </div>
                                  {stepIndex < progressSteps.length - 1 && (
                                    <div className={`absolute left-2 mt-4 h-6 w-0.5 ${step.active ? 'bg-blue-500' : 'bg-gray-300'}`} 
                                         style={{ top: `${stepIndex * 3.5 + 1}rem` }}></div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            {canCancelOrder(order.status) && (
                              <button
                                onClick={() => openCancelModal(order.orderId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Order
                              </button>
                            )}

                            <button
                              onClick={() => toggleOrderExpansion(order.orderId)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {expandedOrder === order.orderId ? 'Hide' : 'View'} Items
                            </button>

                            {order.status === 'delivered' && (
                              <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transform transition-all duration-200 hover:scale-105 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                Rate Order
                              </button>
                            )}

                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Need Help?
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Order Items */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedOrder === order.orderId ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-4">Order Items ({order.orderItems.length})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {order.orderItems.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                  <Image width={500} height={500}
                                    src={item.image[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg hidden items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                                  <div className="text-sm text-gray-600">
                                    <p>Qty: {item.quantity} × ${formatPrice(item.price)}</p>
                                    {item.brand && <p>Brand: {item.brand}</p>}
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">Total: ${formatPrice(item.price * item.quantity)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Total */}
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Subtotal:</span>
                                <span>${formatPrice(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Tax:</span>
                                <span>${formatPrice(order.tax)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Shipping:</span>
                                <span>${formatPrice(order.shippingCost)}</span>
                              </div>
                              <div className="border-t pt-2 flex justify-between items-center text-lg font-bold text-gray-900">
                                <span>Total Paid:</span>
                                <span>${formatPrice(order.total)}</span>
                              </div>
                            </div>
                            {order.paymentMethod === 'cod' && (
                              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <p className="text-sm text-orange-800 font-medium">💰 Cash on Delivery</p>
                                <p className="text-sm text-orange-700">Pay ${formatPrice(order.total)} when your order arrives</p>
                              </div>
                            )}
                            {order.paymentMethod === 'card' && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 font-medium">✅ Paid with Card</p>
                                <p className="text-sm text-green-700">Payment completed successfully</p>
                              </div>
                            )}
                          </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet or no orders match your filter.</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-200 hover:scale-105">
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to cancel this order?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. If you&apos;ve already paid, a refund will be processed within 3-5 business days.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setCancelModal({ show: false, orderId: null })}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(cancelModal.orderId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}