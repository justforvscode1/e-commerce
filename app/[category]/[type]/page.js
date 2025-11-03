"use client"
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, use } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const CategoryWiseProducts = ({ params }) => {
    const type = decodeURIComponent(use(params).type);
    const Category = decodeURIComponent(use(params).category.toLocaleLowerCase());
    console.log(Category)
    const [activeCategory, setActiveCategory] = useState((type).toLocaleLowerCase());
    const [isLoading, setIsLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setproducts] = useState([])
    const [categories, setcategories] = useState([])

    useEffect(() => {
        const gettheproducts = async () => {

            const allproducts = await fetch(`/api/products`)
            const response = await allproducts.json()


            setproducts(response.filter(items => items.category === Category))
        }

        gettheproducts()


    }, [])
    useEffect(() => {
        if (Category === "fashion") {
            setcategories([
                { id: 'all', name: 'All Collections', count: products.length },
                { id: 'men', name: 'Men', count: products.filter(p => p.productType === 'men').length },
                { id: 'women', name: 'Women', count: products.filter(p => p.productType === 'women').length },
                { id: 'kids', name: 'Kids', count: products.filter(p => p.productType === 'kids').length },
                { id: 'accessories', name: 'Accessories', count: products.filter(p => p.productType === 'accessories').length }
            ])
        } else {
            setcategories(
                [
                    { id: 'all', name: 'All Electronics', count: products.length },
                    { id: 'laptops', name: 'Laptops', count: products.filter(p => p.productType === 'laptops').length },
                    { id: 'smartphones', name: 'Smartphones', count: products.filter(p => p.productType === 'smartphones').length },
                    { id: 'headphones', name: 'Headphones', count: products.filter(p => p.productType === 'headphones').length },
                    { id: 'cameras', name: 'Cameras', count: products.filter(p => p.productType === 'cameras').length },

                ]
            )
        }
    }, [products, activeCategory])




    //    const categories = [
    //         { id: 'all', name: 'All Electronics', count: products.length },
    //         { id: 'laptops', name: 'Laptops', count: products.filter(p => p.productType === 'laptops').length },
    //         { id: 'smartphones', name: 'Smartphones', count: products.filter(p => p.productType === 'smartphones').length },
    //         { id: 'headphones', name: 'Headphones', count: products.filter(p => p.productType === 'headphones').length },
    //         { id: 'cameras', name: 'Cameras', count: products.filter(p => p.productType === 'cameras').length },
    //         { id: 'alll', name: 'All Collections', count: products.length },
    //         { id: 'men', name: 'Men', count: products.filter(p => p.productType === 'men').length },
    //         { id: 'women', name: 'Women', count: products.filter(p => p.productType === 'women').length },
    //         { id: 'kids', name: 'Kids', count: products.filter(p => p.productType === 'kids').length },
    //         { id: 'accessories', name: 'Accessories', count: products.filter(p => p.productType === 'accessories').length }
    //     ];
    useEffect(() => {
        // Simulate loading
        setIsLoading(true);
        setTimeout(() => {
            const filtered = activeCategory === 'all'
                ? products
                : products.filter(product => product.productType === activeCategory);
            setFilteredProducts(filtered);
            setIsLoading(false);
        }, 300);
    }, [products, activeCategory]);

    const handleCategoryChange = (type) => {
        setActiveCategory(type);
    };


    return (<>
        <ToastContainer />
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{Category} Collections</h1>
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
                            <Link href={`/products/${product.productid}`} key={product.productid}> <div
                                className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="relative overflow-hidden">
                                    {/* <Image width={500} height={500}
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                    /> */}



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
                                            {product.rating} ({product.reviewCount} reviews)
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${product.variants[0].price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className=" text-gray-500 line-through">
                                                    ${product.variants[0].salePrice}
                                                </span>
                                            )}
                                        </div>


                                    </div>
                                </div>
                            </div></Link>
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No {Category} products found</h3>
                        <p className="text-gray-500">Try selecting a different category.</p>
                    </div>
                )}
            </div>
        </div>
    </>

    );
};

export default CategoryWiseProducts;