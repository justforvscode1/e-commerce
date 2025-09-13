
"use client"
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const heroSlides = [
    {
      id: 1,
      title: "Latest Fashion Collection",
      subtitle: "Discover Your Style",
      description: "Explore premium fashion items crafted for modern lifestyle",
      image: "/api/placeholder/800/500",
      buttonText: "Shop Fashion",
      category: "fashion"
    },
    {
      id: 2,
      title: "Premium Electronics",
      subtitle: "Innovation Meets Quality",
      description: "Experience cutting-edge technology with our curated electronics",
      image: "/api/placeholder/800/500",
      buttonText: "Shop Electronics",
      category: "electronics"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 124,
      category: "Electronics",
      image: "/api/placeholder/300/300",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Designer Leather Jacket",
      price: 189,
      originalPrice: 249,
      rating: 4.9,
      reviews: 89,
      category: "Fashion",
      image: "/api/placeholder/300/300",
      badge: "New Arrival"
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      price: 229,
      originalPrice: 299,
      rating: 4.7,
      reviews: 156,
      category: "Electronics",
      image: "/api/placeholder/300/300",
      badge: "Trending"
    },
    {
      id: 4,
      name: "Minimalist Handbag",
      price: 129,
      originalPrice: 179,
      rating: 4.8,
      reviews: 201,
      category: "Fashion",
      image: "/api/placeholder/300/300",
      badge: "Limited"
    }
  ];

  const categories = [
    {
      name: "Fashion",
      description: "Style & Elegance",
      itemCount: "2,500+ items",
      image: "/api/placeholder/400/300",
      color: "from-purple-400 to-pink-400"
    },
    {
      name: "Electronics",
      description: "Innovation & Technology",
      itemCount: "1,800+ items",
      image: "/api/placeholder/400/300",
      color: "from-blue-400 to-indigo-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Navbar />



      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section  className="relative h-[600px] overflow-hidden bg-gradient-to-br from-slate-100 to-gray-200">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                ? 'opacity-100 translate-x-0'
                : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
                }`}
            >
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className={`transition-all duration-700 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}>
                      <h3 className="text-sm font-medium text-blue-600 mb-2">{slide.subtitle}</h3>
                      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl text-gray-600 max-w-lg">
                        {slide.description}
                      </p>
                    </div>
                    <div className={`transition-all duration-700 delay-500 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}>
                     <Link href={`/${slide.buttonText.slice(5,)}`} > <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                        {slide.buttonText}
                      </button></Link>
                    </div>
                  </div>
                  <div className={`transition-all duration-700 delay-200 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl transform rotate-6"></div>
                      <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                        <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section id="section-categories" className={`py-20 transition-all duration-1000 ${isVisible['section-categories'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our curated collections designed for your lifestyle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isVisible['section-categories']
                    ? `opacity-100 translate-y-0 delay-${index * 200}`
                    : 'opacity-0 translate-y-8'
                    }`}
                >
                  <div className="aspect-w-16 aspect-h-10">
                    <div className={`w-full h-80 bg-gradient-to-br ${category.color} relative`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-lg opacity-90 mb-2">{category.description}</p>
                        <p className="text-sm opacity-75">{category.itemCount}</p>
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <Link href={`/${category.name}`}>
                          <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            Explore Collection
                          </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section id="section-products" className={`py-20 bg-white transition-all duration-1000 ${isVisible['section-products'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-xl text-gray-600">
                  Handpicked items just for you
                </p>
              </div>
              <button className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${isVisible['section-products']
                    ? `opacity-100 translate-y-0 delay-${index * 100}`
                    : 'opacity-0 translate-y-8'
                    }`}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {product.badge}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{product.category}</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      </div>
                      <button className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {product.reviews} reviews
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="section-stats" className={`py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-1000 ${isVisible['section-stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10K+', label: 'Happy Customers', icon: '👥' },
                { number: '4.9', label: 'Average Rating', icon: '⭐' },
                { number: '2K+', label: 'Products', icon: '📦' },
                { number: '24/7', label: 'Support', icon: '🎧' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${isVisible['section-stats']
                    ? `opacity-100 translate-y-0 delay-${index * 100}`
                    : 'opacity-0 translate-y-8'
                    }`}
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="section-newsletter" className={`py-20 bg-gray-900 text-white transition-all duration-1000 ${isVisible['section-newsletter'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Get the latest updates on new products and exclusive offers
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

