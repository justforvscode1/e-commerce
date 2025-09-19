"use client"
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function AccountPage() {
    const [hoveredCard, setHoveredCard] = useState(null);

    const navigationItems = [
        {
            id: 'orders',
            title: 'Your Orders',
            description: 'View and track your recent purchases',
            icon: '📦',
            href: '/info/your-orders',
            color: 'blue'
        },
        {
            id: 'history',
            title: 'Order History',
            description: 'Browse your complete purchase history',
            icon: '🕒',
            href: '/info/history',
            color: 'black'
        },
        {
            id: 'account',
            title: 'Account Settings',
            description: 'Manage your profile and preferences',
            icon: '👤',
            href: '/info/account',
            color: 'blue'
        }
    ];

    const handleCardClick = (href) => {
        // In a real Next.js app, you'd use router.push(href)
        window.location.href = href;
    };

    return (
        <div className="min-h-screen bg-white animate-fadeIn">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12 animate-slideUp">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Manage Your Account
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Access your orders, browse your purchase history, and update your account settings
                    </p>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {navigationItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`group relative bg-white border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 transform ${hoveredCard === item.id
                                    ? 'border-blue-200 shadow-lg -translate-y-1'
                                    : 'border-gray-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1'
                                }`}
                            onMouseEnter={() => setHoveredCard(item.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => handleCardClick(item.href)}
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div
                                    className={`text-4xl p-4 rounded-xl transition-colors duration-300 ${item.color === 'blue'
                                            ? 'bg-blue-50 group-hover:bg-blue-100'
                                            : 'bg-gray-50 group-hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon}
                                </div>
                                <div
                                    className={`text-xl transition-transform duration-300 ${item.color === 'blue' ? 'text-blue-400' : 'text-gray-400'
                                        } ${hoveredCard === item.id ? 'translate-x-1' : ''}`}
                                >
                                    →
                                </div>
                            </div>

                            <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${hoveredCard === item.id ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
                                }`}>
                                {item.title}
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-sm font-medium transition-colors duration-300 ${item.color === 'blue' ? 'text-blue-600' : 'text-gray-700'
                                        } group-hover:text-blue-700`}
                                >
                                    Go to {item.title}
                                </span>
                                <div
                                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${item.color === 'blue' ? 'bg-blue-600' : 'bg-gray-600'
                                        } group-hover:bg-blue-700`}
                                />
                            </div>
                        </div>
                    ))}
                </div>


            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-20 animate-fadeInDelayed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Need help?
                            <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}