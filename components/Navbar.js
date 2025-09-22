"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setfilteredProducts] = useState([])
    const [length, setlength] = useState()
    const categories = [
        { name: 'Fashion', items: ['Men', 'Women', 'Kids', 'Accessories'] },
        { name: 'Electronics', items: ['Laptops', 'Smartphones', 'Headphones', 'Cameras'] },
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const search = await fetch("/api/products");
            const response = await search.json();
            const searchTerm = e.target.value.toLowerCase();

            // Filter products while keeping all product data
            const filtered = response.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );

            setfilteredProducts(filtered);
        } catch (error) {
            console.error("Search error:", error);
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
                                    <Link key={category.name} href={`/${category.name}/all`}><span>{category.name}</span></Link>
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
                                                href={`/${category.name}/${item}`}
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
                        <form onChange={handleSearch} className="relative w-full">
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
                        <Link href={'/info'}><button className="p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110">
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

            {/* Search Results - Below Navbar */}
            {searchQuery && filteredProducts.length > 0 && (
                <div className="bg-white border-t border-gray-200 shadow-lg max-w-7xl mx-auto px-4">
                    <div className="py-4">
                        <div className="mb-3">
                            <p className="text-sm text-gray-600">
                                Found {filteredProducts.length} result(s) for &quot;{searchQuery}&quot;
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                            {filteredProducts.map((product, index) => (
                                <Link key={product._id} href={`/products/${product.id}`}><div className="hover:translate-y-0.5 hover:shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow duration-200 overflow-hidden">
                                    <div className="aspect-w-16 aspect-h-9">
                                        <img
                                            src={product.image[0]}
                                            alt={product.name}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                            {product.description?.substring(0, 80)}...
                                        </p>

                                    </div>
                                </div></Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* No Results */}
            {searchQuery && filteredProducts.length === 0 && (
                <div className="bg-white border-t border-gray-200 shadow-lg max-w-7xl mx-auto px-4">
                    <div className="py-6 text-center">
                        <p className="text-gray-500">No products found for &quot;{searchQuery}&quot;</p>
                        <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
                    </div>
                </div>
            )}

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
                                                  href={`/${category.name}/${item}`}
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