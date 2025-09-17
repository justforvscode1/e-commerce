"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
const [length, setlength] = useState()
    const categories = [
        { name: 'Fashion', items: ['Men', 'Women', 'Kids', 'Accessories'] },
        { name: 'Electronics', items: ['Laptops', 'Smartphones', 'Headphones', 'Cameras'] },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            alert(`Searching for: ${searchQuery}`);
            // Add your search logic here
        }
    };
useEffect(() => {

    const cartlength = async () => {

      const cart = await fetch("/api/cart")
      const response = await cart.json()
      setlength(response.length)
    }
    cartlength()
  }, [])
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-3 justify-between h-16">

                    <div className="flex items-center ">
                        <Link href={'/'}>
                            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
                                ShopLux
                            </h1></Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex justify-between space-x-8">
                        {categories.map((category) => (

                            <div
                                key={category.name}
                                className="relative group"
                                onMouseEnter={() => setIsDropdownOpen(category.name)}
                                onMouseLeave={() => setIsDropdownOpen(null)} >

                                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2">
                                    <Link key={category.name} href={`/${category.name}`}><span>{category.name}</span></Link>
                                    <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen === category.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-300 transform origin-top ${isDropdownOpen === category.name
                                    ? 'opacity-100 visible scale-y-100 translate-y-0'
                                    : 'opacity-0 invisible scale-y-95 -translate-y-2'
                                    }`}>
                                    <div className="py-2">
                                        {category.items.map((item, index) => (
                                            <a
                                                key={item}
                                                href="#"
                                                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform ${isDropdownOpen === category.name
                                                    ? 'translate-x-0 opacity-100'
                                                    : 'translate-x-2 opacity-0'
                                                    }`}
                                                style={{
                                                    transitionDelay: isDropdownOpen === category.name ? `${index * 50}ms` : '0ms'
                                                }}
                                            >
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search Bar */}
                    < div className="hidden md:flex flex-1 max-w-lg mx-8" >
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">

                        {/* Wishlist */}


                        {/* User Account */}
                        <Link href={'/settings'}><button className="p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button></Link>

                        {/* Shopping Cart */}
                        <Link href={"/my-cart"}><button className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16v0a1 1 0 001 1h11M7 13v4a2 2 0 002 2h4a2 2 0 002-2v-4" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {length}
                            </span>
                        </button></Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-all duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="bg-white border-t border-gray-200">
                    <div className="px-4 py-4">

                        {/* Mobile Search */}
                        <div className="mb-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </form>
                        </div>

                        {/* Mobile Categories */}
                        <div className="space-y-2">
                            {categories.map((category, index) => (
                                <div key={category.name} className="border-b border-gray-100 last:border-b-0">
                                    <button
                                        onClick={() => setIsDropdownOpen(isDropdownOpen === category.name ? null : category.name)}
                                        className="w-full flex items-center justify-between py-3 text-left text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        <span className="font-medium">{category.name}</span>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen === category.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen === category.name ? 'max-h-48 opacity-100 pb-2' : 'max-h-0 opacity-0'
                                        }`}>
                                        {category.items.map((item) => (
                                            <a
                                                key={item}
                                                href="#"
                                                className="block pl-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                            >
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}


                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;