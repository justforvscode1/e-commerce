"use client"
import Navbar from "@/components/Navbar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [optiontypekeys, setoptiontypekeys] = useState([])
  const { data, status } = useSession()

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


  // useEffect(() => {
  //   console.log(data, status)
  // }, [status])

  useEffect(() => {

    (async () => {
      try {
        const gettheitems = await fetch(`/api/products`)
        const items = await gettheitems.json()
        if (Array.isArray(items) && items.length > 4) {
          setFeaturedProducts(items.slice(-4))

        }

      } catch (error) {
        console.error("Error fetching products:", error)
      }
    })()

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

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
      <button onClick={() => { signOut() }}>logout</button>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden bg-gradient-to-br from-slate-100 to-gray-200">
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
                      <Link href={`/${slide.buttonText.slice(5).toLowerCase()}/all`}>
                        <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                          {slide.buttonText}
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className={`transition-all duration-700 delay-200 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl transform rotate-6"></div>
                      <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                        <div className="relative bg-gradient-to-br w-full h-90  from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                          <img
                            width={500} height={500}
                            src={ index === 0 ? '/fashion-slide.png' : "/electronics-slide.png"}
                            alt="slide image"
                            className="object-fit w-full h-90 "
                          />
          
                         
                        </div>
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
                    <div className={`w-full h-80  relative`}>
                      <img
                        src={index === 0 ? '/fashion-section.png' : "/electronics-section.png"} alt="image"
                    className="w-full h-80"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <Link href={`product/${category.name}/all`}>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => {
                const productImage = product.variants?.[0]?.images?.[0];
                return (
                  <Link key={product.productid} href={`/product/${product.productid}`}> <div
                    className={`group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${isVisible['section-products']
                      ? `opacity-100 translate-y-0 delay-${index * 100}`
                      : 'opacity-0 translate-y-8'
                      }`}
                  >
                    <div className="relative overflow-hidden rounded-t-2xl h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                      {productImage ? (
                        <Image
                          src={productImage}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          alt={product.name || "product image"}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {/* <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
            </button> */}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{product.category}</span>
                        <div className="flex items-center">
                          {/* <span className="text-sm text-gray-600 ml-1">⭐ {product.rating}</span> */}
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">${product.variants[0].price}</span>
                          <span className="text-sm text-gray-500 line-through">${product.variants[0].salePrice}</span>
                        </div>
                        <button className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
                        </button>
                      </div>

                      {/* <p className="text-sm text-gray-500 mt-2">
                      3 reviews
                    </p> */}
                    </div>
                  </div></Link>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}