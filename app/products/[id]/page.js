// app/product/[id]/page.js
'use client';
import { use } from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';

// Mock data - in a real app, this would come from an API or database
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

export default function ProductPage({ params }) {
  const router = useRouter();
  const id = decodeURIComponent(use(params).id); 
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [product, setproduct] = useState([])

  // Get product data
  const getproduct= () => {
    const getit= products.filter(items=>items.id= id)
    if (getit!=[]) {
      setproduct(getit)

    } else {
      notFound()
    }
  }
  
 
  

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsAddingToCart(false);
    // In a real app, you'd dispatch to cart state or call an API
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:scale-110 transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="ml-4 text-xl font-semibold text-gray-900">Modern Store</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.195.195-.195.512 0 .707L7 18.293M7 13v4a2 2 0 002 2h6m3-16a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1V5a1 1 0 011-1h8z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      
      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group relative">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-700">
                <div className="text-center animate-fade-in">
                  <div className="w-32 h-32 mx-auto bg-white rounded-2xl mb-4 flex items-center justify-center shadow-lg">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{product.name}</p>
                </div>
              </div>
              
              {/* Image Navigation Arrows */}
              <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.map((data, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Price & Title */}
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                  {product.inStock && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 animate-pulse">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      In Stock
                    </span>
                  )}
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {product.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline">
                  Write a Review
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-16 text-center font-bold text-xl bg-gray-50 py-3 rounded-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isAddingToCart ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding to Cart...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.195.195-.195.512 0 .707L7 18.293M7 13v4a2 2 0 002 2h6m3-16a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1V5a1 1 0 011-1h8z" />
                    </svg>
                    <span>Add to Cart</span>
                  </div>
                )}
              </button>
              
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] border border-gray-300">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-bold text-gray-900 mb-6">What's Included</h3>
              <div className="space-y-4">
                {[
                  'Premium Quality Materials',
                  'Free Shipping & Returns',
                  '2-Year Warranty',
                  '24/7 Customer Support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
