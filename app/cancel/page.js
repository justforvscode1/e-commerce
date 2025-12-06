"use client"
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function UserOrdersDashboard() {
  const { data, status } = useSession()
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelModal, setCancelModal] = useState({ show: false, orderId: null });

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserOrders = async () => {
        try {
          const getthedata = await fetch(`/api/order//${data.user.id}`)
          const apidata = await getthedata.json()
          setOrders(apidata);
        } catch (error) {
          console.error('Error fetching user orders:', error);
        } finally {
          setLoading(false);
        };
      }
      fetchUserOrders()
    }
  }, [status, data?.user?.id]);

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
    return priceInCents.toFixed(2);
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
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        label: 'Order Placed'
      },
      assigned: {
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        label: 'Being Prepared'
      },
      out_for_delivery: {
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        label: 'Out for Delivery'
      },
      delivered: {
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        label: 'Delivered'
      },
      cancelled: {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
        label: 'Cancelled'
      }
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'high') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
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
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 h-64"></div>
              </div>
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-50 rounded-lg p-6 h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">Order History</h1>
          <p className="text-sm sm:text-base text-gray-600">Track and manage your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Order Stats */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>

              <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 sm:gap-4">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:py-3 lg:border-b border-gray-100">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Active</span>
                  <span className="text-base sm:text-lg font-semibold text-blue-600">
                    {orders.filter(o => ['pending', 'assigned', 'out_for_delivery'].includes(o.status)).length}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center lg:py-3 lg:border-b border-gray-100">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Delivered</span>
                  <span className="text-base sm:text-lg font-semibold text-emerald-600">
                    {orders.filter(o => o.status === 'delivered').length}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center lg:py-3 lg:border-b border-gray-100">
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Cancelled</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-600">
                    {orders.filter(o => o.status === 'cancelled').length}
                  </span>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center lg:py-3">
                  <span className="text-xs sm:text-sm font-bold text-gray-900">Total</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900">{orders.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Status Filter */}
            <div className="mb-4 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max pb-2 sm:pb-0 sm:flex-wrap">
                {[
                  { key: 'all', label: 'All', count: orders.length },
                  { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                  { key: 'assigned', label: 'Preparing', count: orders.filter(o => o.status === 'assigned').length },
                  { key: 'out_for_delivery', label: 'In Transit', count: orders.filter(o => o.status === 'out_for_delivery').length },
                  { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
                  { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === filter.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.map((order, index) => {
                const statusBadge = getStatusBadge(order.status);
                const priorityBadge = getPriorityBadge(order.priority);
                const progressSteps = getOrderStatusProgress(order.status, order.createdat, order.assignedat, order.pickedat, order.deliveredat, order.cancelledat);

                return (
                  <div
                    key={order.orderId}
                    className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              Order #{order.orderId.substring(0, 8).toUpperCase()}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusBadge.bgColor} ${statusBadge.textColor} ${statusBadge.borderColor}`}>
                              {statusBadge.label}
                            </span>
                            {priorityBadge}
                          </div>

                          {/* Order Meta */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Order Date</p>
                              <p className="font-medium text-gray-900">{formatDate(order.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Items</p>
                              <p className="font-medium text-gray-900">{order.orderedItems.length} item(s)</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Amount</p>
                              <p className="font-medium text-gray-900">${formatPrice(order.total)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Expected Delivery</p>
                              <p className="font-medium text-gray-900">
                                {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'TBD'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {canCancelOrder(order.status) && (
                            <button
                              onClick={() => openCancelModal(order.orderId)}
                              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel Order
                            </button>
                          )}
                          <button
                            onClick={() => toggleOrderExpansion(order.orderId)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            {expandedOrder === order.orderId ? 'Hide Details' : 'View Details'}
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                          <span>Order Progress</span>
                        </div>
                        <div className="relative">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
                          <div className="relative flex justify-between">
                            {progressSteps.map((step, index) => (
                              <div key={step.key} className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full border-2 z-10 ${step.active
                                  ? step.cancelled
                                    ? 'bg-red-500 border-red-500'
                                    : 'bg-gray-900 border-gray-900'
                                  : 'bg-white border-gray-300'
                                  }`}></div>
                                <div className="mt-2 text-xs text-center">
                                  <div className={`font-medium ${step.active ? 'text-gray-900' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                  </div>
                                  {step.date && (
                                    <div className="text-gray-400 mt-1">
                                      {formatDate(step.date)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${expandedOrder === order.orderId ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="border-t border-gray-200 pt-6">
                          {/* Order Items */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                            <div className="space-y-3">
                              {order.orderedItems.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={176}
                                      height={176}
                                      className="object-cover w-full h-full"
                                      unoptimized={item.image?.startsWith('/uploads')}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity} × ${formatPrice(item.price)}</p>
                                    {item.brand && <p className="text-xs text-gray-500">Brand: {item.brand}</p>}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                      ${formatPrice(item.price * item.quantity)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-gray-900 mb-2">Shipping Address</p>
                                <p className="text-sm text-gray-600">{formatShippingAddress(order.shippingForm)}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">${formatPrice(order.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900">${formatPrice(order.tax)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-900">${formatPrice(order.shippingCost)}</span>
                                  </div>
                                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="font-semibold text-gray-900">${formatPrice(order.total)}</span>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className={`text-sm font-medium ${order.paymentMethod === 'cod' ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>
                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid with Card'}
                                  </p>
                                </div>
                              </div>
                            </div>
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
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter === 'all'
                    ? "You haven't placed any orders yet."
                    : `No ${statusFilter} orders found.`}
                </p>
                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-gray-600 text-sm">
                This action cannot be undone. The order will be permanently cancelled.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal({ show: false, orderId: null })}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancelOrder(cancelModal.orderId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}