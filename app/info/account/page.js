"use client"

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function AdminProductPage() {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        originalPrice: '',
        rating: '',
        reviewCount: '',
        category: '',
        brand: '',
        type: '',
        isNew: false,
        inStock: true,
        stockCount: '',
        description: '',
        image: [''],
        images: ['', '']
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [productObject, setProductObject] = useState(null);

    const categories = ['fashion', 'electronics', 'home', 'sports', 'beauty', 'books'];
    const types = ['accessories', 'clothing', 'shoes', 'gadgets', 'furniture', 'other'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (index, value, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((img, i) => i === index ? value : img)
        }));
    };

    const addImageField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeImageField = (index, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const generateProductObject = async () => {
        const product = {
            id: formData.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: formData.name,
            price: parseInt(formData.price) || 0,
            originalPrice: parseInt(formData.originalPrice) || 0,
            rating: parseFloat(formData.rating) || 0,
            reviewCount: parseInt(formData.reviewCount) || 0,
            category: formData.category,
            brand: formData.brand,
            type: formData.type,
            isNew: formData.isNew,
            inStock: formData.inStock,
            stockCount: parseInt(formData.stockCount) || 0,
            description: formData.description,
            image: formData.image.filter(img => img.trim() !== ''),
            images: formData.images.filter(img => img.trim() !== '')
        };
        try {
            const senddata = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            })


            const response = await senddata.json()
            toast.success("successfully added your product")
        } catch (error) {

            toast.error(" error occured . try later")
        }
        // console.log(product)
        // setProductObject(product);
        // setShowPreview(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        generateProductObject();
        setIsSubmitting(false);
    };

    return (<>
        <ToastContainer />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 transform transition-all duration-700 hover:scale-105">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Management</h1>
                        <p className="text-gray-600">Add new products to your e-commerce store</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                            <h2 className="text-2xl font-semibold text-white">Add New Product</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Basic Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Brand *</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter brand name"
                                    />
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Current Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Original Price</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Category and Type */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Type *</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="">Select type</option>
                                        {types.map(type => (
                                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Rating and Reviews */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="4.5"
                                    />
                                </div>

                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Review Count</label>
                                    <input
                                        type="number"
                                        name="reviewCount"
                                        value={formData.reviewCount}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Stock Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Stock Count *</label>
                                    <input
                                        type="number"
                                        name="stockCount"
                                        value={formData.stockCount}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-4 pt-6">
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center space-x-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                name="isNew"
                                                checked={formData.isNew}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200 group-hover:scale-110"
                                            />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">New Product</span>
                                        </label>

                                        <label className="flex items-center space-x-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                name="inStock"
                                                checked={formData.inStock}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-all duration-200 group-hover:scale-110"
                                            />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-200">In Stock</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2 transform transition-all duration-300 hover:translate-y-1">
                                <label className="block text-sm font-medium text-gray-700">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Enter product description..."
                                />
                            </div>

                            {/* Images */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Main Images</label>
                                    {formData.image.map((img, index) => (
                                        <div key={index} className="flex gap-2 transform transition-all duration-300 hover:translate-x-2">
                                            <input
                                                type="url"
                                                value={img}
                                                onChange={(e) => handleImageChange(index, e.target.value, 'image')}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {formData.image.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index, 'image')}
                                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addImageField('image')}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-all duration-200 hover:scale-105"
                                    >
                                        + Add Image
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Additional Images</label>
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="flex gap-2 transform transition-all duration-300 hover:translate-x-2">
                                            <input
                                                type="url"
                                                value={img}
                                                onChange={(e) => handleImageChange(index, e.target.value, 'images')}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {formData.images.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index, 'images')}
                                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addImageField('images')}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-all duration-200 hover:scale-105"
                                    >
                                        + Add Additional Image
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                            Creating Product...
                                        </div>
                                    ) : (
                                        'Create Product'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Modal */}
                    {showPreview && productObject && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
                            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto transform transition-all duration-300 animate-slideUp">
                                <div className="p-6 border-b">
                                    <h3 className="text-2xl font-bold text-gray-800">Product Object Created</h3>
                                </div>
                                <div className="p-6">
                                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                        {JSON.stringify(productObject, null, 2)}
                                    </pre>
                                </div>
                                <div className="p-6 border-t">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    </>
    );
}