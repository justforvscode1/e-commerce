"use client"
"use client"
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const ElectronicsCollections = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Sample product data
    const products = [
        {
            id: 1,
            name: "MacBook Pro 16-inch M3",
            price: 2499.99,
            originalPrice: 2799.99,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=500&fit=crop",
            category: "laptops",
            isNew: true,
            brand: "Apple",
            rating: 4.8,
            reviews: 245
        },
        {
            id: 2,
            name: "iPhone 15 Pro Max",
            price: 1199.99,
            originalPrice: 1299.99,
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=500&fit=crop",
            category: "smartphones",
            isNew: false,
            brand: "Apple",
            rating: 4.9,
            reviews: 567
        },
        {
            id: 3,
            name: "Sony WH-1000XM5 Headphones",
            price: 349.99,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
            category: "headphones",
            isNew: true,
            brand: "Sony",
            rating: 4.7,
            reviews: 432
        },
        {
            id: 4,
            name: "Canon EOS R6 Mark II",
            price: 2499.99,
            originalPrice: 2699.99,
            image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=500&fit=crop",
            category: "cameras",
            isNew: false,
            brand: "Canon",
            rating: 4.8,
            reviews: 189
        },
        {
            id: 5,
            name: "Dell XPS 13 Plus",
            price: 1299.99,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=500&fit=crop",
            category: "laptops",
            isNew: false,
            brand: "Dell",
            rating: 4.6,
            reviews: 156
        },
        {
            id: 6,
            name: "Samsung Galaxy S24 Ultra",
            price: 1199.99,
            originalPrice: 1299.99,
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop",
            category: "smartphones",
            isNew: true,
            brand: "Samsung",
            rating: 4.7,
            reviews: 423
        },
        {
            id: 7,
            name: "AirPods Pro (2nd Gen)",
            price: 249.99,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=500&fit=crop",
            category: "headphones",
            isNew: false,
            brand: "Apple",
            rating: 4.6,
            reviews: 789
        },
        {
            id: 8,
            name: "Sony A7R V Mirrorless",
            price: 3899.99,
            originalPrice: 4199.99,
            image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=500&fit=crop",
            category: "cameras",
            isNew: true,
            brand: "Sony",
            rating: 4.9,
            reviews: 134
        },
        {
            id: 9,
            name: "Gaming Laptop RTX 4080",
            price: 2199.99,
            originalPrice: 2499.99,
            image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=500&fit=crop",
            category: "laptops",
            isNew: true,
            brand: "ASUS",
            rating: 4.7,
            reviews: 298
        },
        {
            id: 10,
            name: "Google Pixel 8 Pro",
            price: 999.99,
            originalPrice: null,
            image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop",
            category: "smartphones",
            isNew: false,
            brand: "Google",
            rating: 4.5,
            reviews: 267
        },
        {
            id: 11,
            name: "Bose QuietComfort Ultra",
            price: 429.99,
            originalPrice: 479.99,
            image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=500&fit=crop",
            category: "headphones",
            isNew: true,
            brand: "Bose",
            rating: 4.8,
            reviews: 345
        },
        {
            id: 12,
            name: "Fujifilm X-T5 Camera",
            price: 1699.99,
            originalPrice: 1899.99,
            image: "https://images.unsplash.com/photo-1606986628253-6e6d67de3ab8?w=400&h=500&fit=crop",
            category: "cameras",
            isNew: false,
            brand: "Fujifilm",
            rating: 4.7,
            reviews: 178
        }
    ];

    const categories = [
        { id: 'all', name: 'All Electronics', count: products.length },
        { id: 'laptops', name: 'Laptops', count: products.filter(p => p.category === 'laptops').length },
        { id: 'smartphones', name: 'Smartphones', count: products.filter(p => p.category === 'smartphones').length },
        { id: 'headphones', name: 'Headphones', count: products.filter(p => p.category === 'headphones').length },
        { id: 'cameras', name: 'Cameras', count: products.filter(p => p.category === 'cameras').length }
    ];

    useEffect(() => {
        // Simulate loading
        setIsLoading(true);
        setTimeout(() => {
            const filtered = activeCategory === 'all'
                ? products
                : products.filter(product => product.category === activeCategory);
            setFilteredProducts(filtered);
            setIsLoading(false);
        }, 300);
    }, [activeCategory]);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Electronics Collections</h1>
                    <p className="text-lg text-gray-600">Discover the latest in technology and innovation</p>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${activeCategory === category.id
                                        ? 'bg-black text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                                    }`}
                                style={{
                                    animation: activeCategory === category.id ? 'pulse 2s infinite' : 'none'
                                }}
                            >
                                {category.name}
                                <span className="ml-2 text-sm opacity-75">({category.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <Link href={`/products/${product.name}`} key={product.id}>
                                <div
                                    className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                        />

                                        {product.isNew && (
                                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                New
                                            </div>
                                        )}

                                        {product.originalPrice && (
                                            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                Sale
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex space-x-4">
                                                <button className="p-3 bg-white rounded-full text-gray-800 hover:bg-gray-100 transform transition-transform hover:scale-110">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5H19" />
                                                    </svg>
                                                </button>
                                                <button className="p-3 bg-white rounded-full text-red-500 hover:bg-gray-100 transform transition-transform hover:scale-110">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {product.name}
                                        </h3>

                                        {/* Brand */}
                                        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

                                        {/* Rating */}
                                        <div className="flex items-center mb-3">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {product.rating} ({product.reviews} reviews)
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xl font-bold text-gray-900">
                                                    ${product.price}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ${product.originalPrice}
                                                    </span>
                                                )}
                                            </div>

                                            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transform transition-all duration-300 hover:scale-105">
                                               + Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {filteredProducts.length === 0 && !isLoading && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No electronics found</h3>
                        <p className="text-gray-500">Try selecting a different category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ElectronicsCollections;