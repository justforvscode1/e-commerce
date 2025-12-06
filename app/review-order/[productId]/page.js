"use client";
import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductReviewPage({ params }) {
  const productId = decodeURIComponent(use(params).productId);

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [],
    productId
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (formData.comment.trim() && formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    } else if (formData.comment.trim().length > 1000) {
      newErrors.comment = 'Comment must not exceed 1000 characters';
    }

    if (formData.images.length > 5) {
      newErrors.images = 'Maximum 5 images allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const sendingReview = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (sendingReview.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setFormData({ rating: 0, title: '', comment: '', images: [], productId });
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      setErrors({ ...errors, images: 'Maximum 5 images allowed' });
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });

    setErrors({ ...errors, images: '' });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const StarIcon = ({ filled, size = "w-7 h-7 sm:w-8 sm:h-8" }) => (
    <svg className={size} viewBox="0 0 24 24" fill={filled ? "#2563eb" : "none"} stroke="#2563eb" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-sm mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">Thank you for your feedback. Your review is pending approval.</p>
          <Link
            href={`/product/${productId}`}
            className="inline-block bg-blue-600 text-white text-sm sm:text-base px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Product
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href={`/product/${productId}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Write a Review</h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">Share your experience</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
          {/* Rating Section */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                >
                  <StarIcon filled={star <= (hoveredRating || formData.rating)} />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {formData.rating === 0 && "Tap to rate"}
              {formData.rating === 1 && "Poor"}
              {formData.rating === 2 && "Fair"}
              {formData.rating === 3 && "Good"}
              {formData.rating === 4 && "Very Good"}
              {formData.rating === 5 && "Excellent!"}
            </p>
            {errors.rating && <p className="mt-1.5 text-xs sm:text-sm text-red-600">{errors.rating}</p>}
          </div>

          {/* Title */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="title" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm sm:text-base"
              placeholder="Summarize your experience"
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.title && <p className="text-xs sm:text-sm text-red-600">{errors.title}</p>}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">{formData.title.length}/100</p>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4 sm:mb-6">
            <label htmlFor="comment" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-sm sm:text-base"
              placeholder="Tell us more about your experience (optional)"
              maxLength={1000}
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.comment && <p className="text-xs sm:text-sm text-red-600">{errors.comment}</p>}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500">{formData.comment.length}/1000</p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Add Photos <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">Upload up to 5 images</p>

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={img}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.images.length < 5 && (
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-blue-500 active:border-blue-600 transition-colors">
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" />
                      <polyline points="21 15 16 10 5 21" strokeWidth="2" />
                    </svg>
                    <span className="mt-2 text-xs sm:text-sm text-gray-600">Tap to upload images</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{formData.images.length}/5 uploaded</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            {errors.images && <p className="mt-2 text-xs sm:text-sm text-red-600">{errors.images}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 sm:py-3.5 px-6 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Review'}
          </button>
        </form>

        {/* Guidelines */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">Review Guidelines</h3>
          <ul className="text-[10px] sm:text-xs text-blue-800 space-y-1">
            <li>• Be honest and helpful to other shoppers</li>
            <li>• Focus on the product features and your experience</li>
            <li>• Avoid inappropriate language or personal info</li>
          </ul>
        </div>
      </div>
    </div>
  );
}