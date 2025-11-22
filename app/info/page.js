"use client"
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';

// SVG Icons
const OrderHistoryIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AccountSettingsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SupportIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState(null);

  const navigationItems = [
    {
      id: 'history',
      title: 'Order History',
      description: 'Track and review your complete purchase journey and order status',
      icon: OrderHistoryIcon,
      href: '/info/history',
      color: 'blue'
    },
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Manage your profile information, security settings, and preferences',
      icon: AccountSettingsIcon,
      href: '/info/profile',
      color: 'green'
    }
  ];

  const quickActions = [
    { label: 'Download Invoice', href: '/invoices' },
    { label: 'Update Password', href: '/security' },
    { label: 'Payment Methods', href: '/payments' },
    { label: 'Notification Settings', href: '/notifications' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Account Dashboard
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Welcome back! Manage your orders, account settings, and preferences.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Last login: Today, 10:24 AM</span>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <OrderHistoryIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Account Status</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">Active</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <SupportIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Navigation Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {navigationItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                      activeSection === item.id 
                        ? `border-${item.color}-300 bg-${item.color}-50` 
                        : `border-gray-200 hover:border-${item.color}-200 hover:bg-${item.color}-25`
                    }`}
                    onMouseEnter={() => setActiveSection(item.id)}
                    onMouseLeave={() => setActiveSection(null)}
                    onClick={() => window.location.href = item.href}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center mt-4 text-sm font-medium text-gray-500 group-hover:text-gray-700">
                          <span>Access now</span>
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors duration-200 border border-gray-200"
                  >
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <OrderHistoryIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #12345 shipped</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AccountSettingsIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Password updated</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <SupportIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Support ticket resolved</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>

              {/* Support CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <SupportIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Our support team is available 24/7
                  </p>
                  <Link 
                    href="/support" 
                    className="inline-block w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}