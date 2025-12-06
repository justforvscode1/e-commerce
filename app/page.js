"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [reviews, setreviews] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  // const kh= Noti
  const heroSlides = [
    {
      id: 1,
      title: "Latest Fashion Collection",
      subtitle: "Discover Your Style",
      description: "Explore premium fashion items crafted for modern lifestyle",
      buttonText: "Shop Fashion",
      category: "fashion"
    },
    {
      id: 2,
      title: "Premium Electronics",
      subtitle: "Innovation Meets Quality",
      description: "Experience cutting-edge technology with our curated electronics",
      buttonText: "Shop Electronics",
      category: "electronics"
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
  const avgrating = (e) => {
    const filterreviews = reviews.filter(r => r.productId === e);
    if (filterreviews.length === 0) return 0;
    const avg = filterreviews.reduce((sum, r) => sum + r.rating, 0) / filterreviews.length;
    return avg.toFixed(1);
  }

  useEffect(() => {

    (async () => {
      try {
        setIsLoading(true);
        const gettheitems = await fetch(`/api/products`)

        const items = await gettheitems.json()
        if (Array.isArray(items) && items.length > 4) {
          setFeaturedProducts(items.slice(-4))

        }
        const getreviews = await fetch("/api/review")
        const reviewresponse = await getreviews.json()
        setreviews(reviewresponse)
        console.log("Fetched reviews:", reviewresponse)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false);
      }
    })()

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);
  const renderStars = (rating, size = 'text-lg') => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`${size} text-yellow-500`}>
            {star <= fullStars ? '★' : (star === fullStars + 1 && hasHalfStar ? '★' : '☆')}
          </span>
        ))}
      </div>
    );
  };
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

  // Loading skeleton component for products
  const ProductSkeleton = () => (
    <div className="flex-shrink-0 w-[75%] sm:w-[48%] lg:w-full snap-center bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
      {/* Image skeleton */}
      <div className="h-36 sm:h-48 lg:h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>
      {/* Content skeleton */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-14 sm:w-20 animate-pulse"></div>
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <div className="h-3.5 sm:h-4 lg:h-5 bg-gray-200 rounded-full w-full animate-pulse"></div>
          <div className="h-3.5 sm:h-4 lg:h-5 bg-gray-200 rounded-full w-2/3 animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <div className="h-5 sm:h-6 lg:h-7 bg-gray-200 rounded-full w-16 sm:w-20 animate-pulse"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-10 sm:w-12 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Responsive */}
        <section className="relative h-[380px] sm:h-[480px] lg:h-[580px] overflow-hidden bg-gradient-to-br from-slate-100 to-gray-200">
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
              <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center w-full">
                  {/* Text Content */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6 text-center lg:text-left order-2 lg:order-1 px-2 sm:px-0">
                    <div className={`transition-all duration-700 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}>
                      <h3 className="text-[10px] sm:text-xs lg:text-sm font-medium text-blue-600 mb-0.5 sm:mb-1 lg:mb-2">{slide.subtitle}</h3>
                      <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 mt-1.5 sm:mt-2 lg:mt-4 line-clamp-2 sm:line-clamp-none">
                        {slide.description}
                      </p>
                    </div>
                    <div className={`transition-all duration-700 delay-500 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}>
                      <Link href={`/products/${slide.buttonText.slice(5).toLowerCase()}/all`}>
                        <button className="bg-blue-600 text-white px-4 sm:px-5 lg:px-8 py-2 sm:py-2.5 lg:py-3.5 rounded-lg font-medium text-xs sm:text-sm lg:text-base hover:bg-blue-700 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl">
                          {slide.buttonText}
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className={`transition-all duration-700 delay-200 order-1 lg:order-2 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                    <div className="relative max-w-[200px] sm:max-w-[280px] lg:max-w-none mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl sm:rounded-2xl lg:rounded-3xl transform rotate-6"></div>
                      <div className="relative bg-white p-2 sm:p-3 lg:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl">
                        <div className="relative bg-gradient-to-br w-full h-28 sm:h-44 lg:h-72 from-gray-100 to-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                          <Image
                            width={500} height={500}
                            src={index === 0 ? '/fashion-slide.png' : "/electronics-slide.png"}
                            alt="slide image"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-3 sm:bottom-5 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 lg:space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 sm:h-2 lg:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-blue-600 w-4 sm:w-6 lg:w-8'
                  : 'bg-gray-400 w-1.5 sm:w-2 lg:w-3'
                  }`}
              />
            ))}
          </div>
        </section>

        {/* Categories Section - Horizontal swipeable on mobile */}
        <section id="section-categories" className={`py-8 sm:py-12 lg:py-16 transition-all duration-1000 ${isVisible['section-categories'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="text-center mb-5 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1.5 sm:mb-2 lg:mb-4">
                Shop by Category
              </h2>
              <p className="text-xs sm:text-sm lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Discover our curated collections designed for your lifestyle
              </p>
            </div>

            {/* Horizontal swipeable on mobile, grid on tablet+ */}
            <div className="flex sm:grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
              {categories.map((category, index) => (
                <Link href={`products/${category.name}/all`} key={category.name} className="flex-shrink-0 w-[85%] sm:w-full snap-center">
                  <div
                    className={`group relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl h-full ${isVisible['section-categories']
                      ? `opacity-100 translate-y-0`
                      : 'opacity-0 translate-y-8'
                      }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className={`w-full h-44 sm:h-52 lg:h-72 relative`}>
                      <Image width={500} height={500}
                        src={index === 0 ? '/fashion-section.png' : "/electronics-section.png"}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>

                      {/* Category info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white">
                        <h3 className="text-base sm:text-lg lg:text-2xl font-bold mb-0.5 sm:mb-1">{category.name}</h3>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-gray-200 mb-1 sm:mb-2">{category.itemCount}</p>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <span className="inline-flex items-center text-xs sm:text-sm font-medium text-white">
                            Explore
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile swipe indicator - only show when more than 1 category */}
            {categories.length > 1 && (
              <div className="flex justify-center mt-3 sm:hidden">
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Swipe to explore
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Products - Horizontal swipeable with loading skeleton */}
        <section id="section-products" className={`py-8 sm:py-12 lg:py-16 bg-white transition-all duration-1000 ${isVisible['section-products'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            {/* Section Header */}
            <div className="flex justify-between items-start sm:items-center mb-5 sm:mb-8 lg:mb-12">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1 lg:mb-2">
                  Featured Products
                </h2>
                <p className="text-xs sm:text-sm lg:text-lg text-gray-600">
                  Handpicked items just for you
                </p>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm lg:text-base shrink-0">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Products Grid - Horizontal scroll on mobile */}
            <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-3 lg:pb-0 -mx-3 px-3 lg:mx-0 lg:px-0 scrollbar-hide">
              {isLoading ? (
                // Loading Skeletons
                <>
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                  <ProductSkeleton />
                </>
              ) : featuredProducts.length === 0 ? (
                // Empty state
                <div className="col-span-4 text-center py-12">
                  <p className="text-gray-500">No featured products available</p>
                </div>
              ) : (
                // Actual Products
                featuredProducts.map((product, index) => {
                  const productImage = product.variants?.[0]?.images?.[0];
                  // Create slug for fallback image
                  const productSlug = product.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                  const imageSrc = productImage || `/uploads/products/${productSlug}.png`;
                  return (
                    <Link key={product.productid} href={`/product/${product.productid}`} className="flex-shrink-0 w-[75%] sm:w-[48%] lg:w-full snap-center">
                      <div
                        className={`group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl lg:hover:shadow-2xl transition-all duration-500 lg:hover:-translate-y-2 h-full ${isVisible['section-products']
                          ? `opacity-100 translate-y-0`
                          : 'opacity-0 translate-y-8'
                          }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        {/* Product Image */}
                        <div className="relative overflow-hidden rounded-t-xl sm:rounded-t-2xl h-36 sm:h-48 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              fill
                              sizes="(max-width: 640px) 75vw, (max-width: 1024px) 48vw, 25vw"
                              alt={product.name || "product image"}
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized={imageSrc.startsWith('/uploads')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                        </div>

                        {/* Product Info */}
                        <div className="p-3 sm:p-4 lg:p-5">
                          <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                            <span className="text-[10px] sm:text-xs lg:text-sm text-gray-500 truncate">{product.category}</span>
                          </div>

                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5em]">
                            {product.name}
                          </h3>

                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">${product.variants[0].price}</span>
                              {product.variants[0].salePrice && (
                                <span className="text-[10px] sm:text-xs lg:text-sm text-gray-400 line-through">${product.variants[0].salePrice}</span>
                              )}
                            </div>
                            <span className="text-gray-700 flex items-center text-[10px] sm:text-xs lg:text-sm bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                              <span className="text-yellow-500 mr-0.5">⭐</span>
                              {avgrating(product.productid)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Mobile View All button & Swipe hint - only show swipe when more than 1 product */}
            <div className="flex flex-col items-center gap-2 mt-4 sm:hidden">
              {featuredProducts.length > 1 && (
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Swipe to see more
                </p>
              )}
              <Link href="/products">
                <button className="text-blue-600 font-medium text-xs flex items-center gap-1 px-4 py-2 border border-blue-200 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-colors">
                  View All Products
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />

      {/* Custom styles for scrollbar hiding and shimmer animation */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}