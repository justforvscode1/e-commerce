"use client"
"use client"
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const ElectronicsCollections = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);

const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        originalPrice: 129.99,
        origionalprice: 119.99,
        rating: 4.5,
        reviewCount: 187,
        category: "electronics",
        isNew: false,
        inStock: true,
        description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Features high-quality audio drivers and comfortable over-ear design.',
        image: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop'
        ]
    },
    {
        id: 2,
        name: "Designer Sunglasses",
        price: 199.99,
        originalPrice: 249.99,
        origionalprice: 229.99,
        rating: 4.8,
        reviewCount: 95,
        category: "fashion",
        isNew: true,
        inStock: true,
        description: 'Stylish designer sunglasses with UV protection and polarized lenses. Perfect for sunny days with premium acetate frames and crystal-clear vision.',
        image: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=600&fit=crop'
        ]
    },
    {
        id: 3,
        name: "Smart Watch",
        price: 299.50,
        originalPrice: 399.99,
        origionalprice: 349.99,
        rating: 4.6,
        reviewCount: 142,
        category: "electronics",
        isNew: false,
        inStock: true,
        description: 'Advanced smart watch with fitness tracking, heart rate monitoring, and GPS. Features large AMOLED display and 48-hour battery life.',
        image: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&h=600&fit=crop'
        ]
    },
    {
        id: 4,
        name: "Leather Jacket",
        price: 299.99,
        originalPrice: 399.99,
        origionalprice: 349.99,
        rating: 4.9,
        reviewCount: 78,
        category: "fashion",
        isNew: true,
        inStock: false,
        description: 'Premium genuine leather jacket with classic biker style. Features durable construction, multiple pockets, and comfortable fit for all seasons.',
        image: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop'
        ]
    },
    {
        id: 5,
        name: "Casual Sneakers",
        price: 129.00,
        originalPrice: 169.99,
        origionalprice: 149.99,
        rating: 4.4,
        reviewCount: 203,
        category: "fashion",
        isNew: false,
        inStock: true,
        description: 'Comfortable casual sneakers with breathable mesh upper and cushioned sole. Perfect for everyday wear with durable construction and stylish design.',
        image: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop'
        ]
    },
    {
        id: 6,
        name: "Gaming Headset",
        price: 149.99,
        originalPrice: 199.99,
        origionalprice: 179.99,
        rating: 4.7,
        reviewCount: 156,
        category: "electronics",
        isNew: false,
        inStock: true,
        description: 'Professional gaming headset with 7.1 surround sound and noise-canceling microphone. RGB lighting and comfortable over-ear design for long gaming sessions.',
        image: ["https://images.unsplash.com/photo-1586210055191-bff3c8dc4b4f?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1586210055191-bff3c8dc4b4f?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ]
    },
    {
        id: 7,
        name: "Wireless Earbuds",
        price: 159.99,
        originalPrice: 199.99,
        origionalprice: 179.99,
        rating: 4.3,
        reviewCount: 89,
        category: "electronics",
        isNew: true,
        inStock: true,
        description: 'Premium wireless earbuds with active noise cancellation and wireless charging case. Crystal clear audio with 24-hour total battery life.',
        image: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
        ]
    },
    {
        id: 8,
        name: "Elegant Summer Dress",
        price: 149,
        originalPrice: 199.99,
        origionalprice: 169,
        rating: 4.8,
        reviewCount: 124,
        category: "fashion",
        isNew: true,
        inStock: true,
        description: 'Beautiful flowing summer dress made from lightweight breathable fabric. Features elegant floral patterns and comfortable fit perfect for warm weather occasions.',
        image: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop"],
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
        ]
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
                                        <Image width={500} height={500}
                                            src={product.image[0]}
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
                                                <svg
                                                    className={`w-4 h-4 ${1 <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                </svg>
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
                            {/* <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg> */}
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