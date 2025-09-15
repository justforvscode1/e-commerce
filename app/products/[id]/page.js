// app/product/[id]/page.js
'use client';
import { use, useEffect } from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - in a real app, this would come from an API or database
const products = [
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

export default function ProductPage({ params }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [pictureno, setpictureno] = useState(0)
  const [desclength, setdesclength] = useState(250)
  const [show, setshow] = useState(false)
  const [length, setlength] = useState()
  // Get product data

  const id = decodeURIComponent(use(params).id);
  useEffect(() => {



    const cartlength = async () => {

      const cart = await fetch("/api/cart")
      const response = await cart.json()
      setlength(response.length)
    }
    cartlength()
  }, [])
  const product = products.find(items => items.id == Number(id))
  if (!product) {
    notFound()
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    product.quantity = 1
    const raw = JSON.stringify(product);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("http://localhost:3000/api/cart", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
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
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:scale-110 transform">
                <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="ml-4 text-xl font-semibold text-gray-900">Modern Store</span>
            </div>
            <div className="flex items-center space-x-4">

              <Link href={'/my-cart'}>
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.195.195-.195.512 0 .707L7 18.293M7 13v4a2 2 0 002 2h6m3-16a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1V5a1 1 0 011-1h8z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{length}</span>
                </button></Link>
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
              <Image width={1000} height={500} src={product.images[pictureno]} alt='images'></Image>
              {/* Image Navigation Arrows */}
              <button onClick={() => {
                if (pictureno >= 1) {
                  setpictureno(p => p - 1)
                }
              }

              } className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={() => {
                if (pictureno < product.images.length - 1) {
                  setpictureno(p => p + 1)
                }
              }
              } className="absolute right-4  top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((data, index) => (
                <button
                  key={index}
                  onClick={() => setpictureno(index)}
                  className={`aspect-square bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-300 ${pictureno === index
                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                    }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Image src={data} height={500} width={500} alt='more pictures'></Image>
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
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
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
              {product.description.length > desclength ? <> <p className="text-gray-700 leading-relaxed text-lg">{product.description.slice(0, 250)} <button onClick={() => {
                setdesclength(product.description.length)
                setshow(true)
              }
              } className='text-blue-600 px-3 hover:underline text-sm cursor-pointer'>read more</button> </p></> : <><p className="text-gray-700 leading-relaxed text-lg">{product.description}</p> <button onClick={() => {
                setdesclength(250)
              }
              } className={`text-blue-600 px-3 hover:underline text-sm cursor-pointer ${show ? 'lock' : 'hidden'}`}>read less</button>  </>}
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
