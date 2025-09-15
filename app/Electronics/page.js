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
    const [products, setproducts] = useState([])

    const allproducts = [
        {
            id: 1,
            name: "Men's Leather Jacket",
            price: 12999,
            originalPrice: 17999,
            rating: 4.7,
            reviewCount: 256,
            category: "fashion",
            brand: "Zara",
            type: "men",
            isNew: true,
            inStock: true,
            stockCount: 15,
            description: "Stylish genuine leather jacket with modern slim fit design. Durable, warm, and perfect for casual or evening wear.",
            image: ["https://images.unsplash.com/photo-1534126511673-b6899657816a?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1520975918318-3c83ef89fbb4?w=600&h=600&fit=crop"
            ]
        },
        {
            id: 2,
            name: "Women's Summer Dress",
            price: 7499,
            originalPrice: 9999,
            rating: 4.6,
            reviewCount: 98,
            category: "fashion",
            brand: "H&M",
            type: "women",
            isNew: true,
            inStock: true,
            stockCount: 30,
            description: "Lightweight breathable cotton dress with floral design. Ideal for summer outings and casual wear.",
            image: ["https://images.unsplash.com/photo-1520975918318-3c83ef89fbb4?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1520975918318-3c83ef89fbb4?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop"
            ]
        },
        {
            id: 3,
            name: "Kids' Sports Shoes",
            price: 4999,
            originalPrice: 6999,
            rating: 4.4,
            reviewCount: 120,
            category: "fashion",
            brand: "Nike",
            type: "kids",
            isNew: false,
            inStock: true,
            stockCount: 25,
            description: "Comfortable lightweight shoes for kids with cushioned sole, ideal for daily use and sports activities.",
            image: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600185365483-26d7a4c0b4b1?w=600&h=600&fit=crop"
            ]
        },
        {
            id: 4,
            name: "Leather Handbag",
            price: 9999,
            originalPrice: 13999,
            rating: 4.8,
            reviewCount: 310,
            category: "fashion",
            brand: "Michael Kors",
            type: "accessories",
            isNew: true,
            inStock: true,
            stockCount: 12,
            description: "Premium leather handbag with spacious compartments and elegant design, perfect for work or casual outings.",
            image: ["https://images.unsplash.com/photo-1584916201218-119fc747c2f9?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1584916201218-119fc747c2f9?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9c?w=600&h=600&fit=crop"
            ]
        },
        {
            id: 5,
            name: "Gaming Laptop",
            price: 119999,
            originalPrice: 139999,
            rating: 4.9,
            reviewCount: 542,
            category: "electronics",
            brand: "Asus ROG",
            type: "laptops",
            isNew: true,
            inStock: true,
            stockCount: 8,
            description: "High-performance gaming laptop with RTX 4070 GPU, Intel i9 processor, and 16GB RAM for ultimate gaming experience.",
            image: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop"
            ]
        },
        {
            id: 6,
            name: "Smartphone Pro X",
            price: 99999,
            originalPrice: 114999,
            rating: 4.8,
            reviewCount: 670,
            category: "electronics",
            brand: "Apple",
            type: "smartphones",
            isNew: true,
            inStock: true,
            stockCount: 20,
            description: "Flagship smartphone with stunning OLED display, triple-lens camera, and powerful A-series chip.",
            image: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1510557880182-3d4d3c8ad0c7?w=600&h=600&fit=crop"
            ]
        },
        {
            id: 7,
            name: "Wireless Bluetooth Headphones",
            price: 8999,
            originalPrice: 12999,
            rating: 4.5,
            reviewCount: 187,
            category: "electronics",
            brand: "Sony",
            type: "headphones",
            isNew: false,
            inStock: true,
            stockCount: 42,
            description: "Premium wireless headphones with active noise cancellation and 30-hour battery life. Features high-quality audio drivers and comfortable over-ear design.",
            image: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop"
            ]
        },
        {
            id: 8,
            name: "DSLR Camera 24MP",
            price: 64999,
            originalPrice: 79999,
            rating: 4.7,
            reviewCount: 350,
            category: "electronics",
            brand: "Canon",
            type: "cameras",
            isNew: true,
            inStock: true,
            stockCount: 10,
            description: "Professional DSLR camera with 24MP sensor, 4K video recording, and interchangeable lenses. Ideal for photography enthusiasts.",
            image: ["https://images.unsplash.com/photo-1519183071298-a2962eadcdb9?w=400&h=500&fit=crop"],
            images: [
                "https://images.unsplash.com/photo-1519183071298-a2962eadcdb9?w=600&h=600&fit=crop",
                "https://images.unsplash.com/photo-1519183071298-a2962eadcdb9?w=600&h=600&fit=crop"
            ]
        }
    ];
    useEffect(() => {

        setproducts(allproducts.filter(items => items.category === "electronics"))


    }, [])


    const categories = [
        { id: 'all', name: 'All Electronics', count: products.length },
        { id: 'laptops', name: 'Laptops', count: products.filter(p => p.type === 'laptops').length },
        { id: 'smartphones', name: 'Smartphones', count: products.filter(p => p.type === 'smartphones').length },
        { id: 'headphones', name: 'Headphones', count: products.filter(p => p.type === 'headphones').length },
        { id: 'cameras', name: 'Cameras', count: products.filter(p => p.type === 'cameras').length }
    ];
    useEffect(() => {
        // Simulate loading
        setIsLoading(true);
        setTimeout(() => {
            const filtered = activeCategory === 'all'
                ? products
                : products.filter(product => product.type === activeCategory);
            setFilteredProducts(filtered);
            setIsLoading(false);
        }, 300);
    }, [activeCategory,products]);

    const handleCategoryChange = (type) => {
        setActiveCategory(type);
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
                            <Link href={`/products/${product.id}`} key={product.id}>
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

                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition-all duration-300 hover:scale-105">
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