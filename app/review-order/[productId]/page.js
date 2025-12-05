"use client";
import { useState, use } from 'react';

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
    console.log("Submitting review:", formData);
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const sendingReview = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const respponse = await sendingReview.json();
    console.log("Response from server:", respponse);
    if (sendingReview.ok) {

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({ rating: 0, title: '', comment: '', images: [] });
          setSubmitSuccess(false);
        }, 2000);
      }, 1500);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      setErrors({ ...errors, images: 'Maximum 5 images allowed' });
      return;
    }

    // Convert files to base64 for preview
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

  const StarIcon = ({ filled }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? "#2563eb" : "none"} stroke="#2563eb" strokeWidth="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  const ImageIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="mb-4 flex justify-center">
            <CheckIcon />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Review Submitted!</h2>
          <p className="text-gray-600">Thank you for your feedback. Your review is pending approval.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
          <p className="text-gray-600">Share your experience with this product</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-slide-up">
          {/* Rating Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rating <span className="text-blue-600">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <StarIcon filled={star <= (hoveredRating || formData.rating)} />
                </button>
              ))}
            </div>
            {errors.rating && <p className="mt-2 text-sm text-red-600">{errors.rating}</p>}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Review Title <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="Summarize your experience"
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
              </div>
              <p className="text-xs text-gray-500">{formData.title.length}/100</p>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
              placeholder="Tell us more about your experience (optional)"
              maxLength={1000}
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.comment && <p className="text-sm text-red-600">{errors.comment}</p>}
              </div>
              <p className="text-xs text-gray-500">{formData.comment.length}/1000</p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-3">Upload up to 5 images</p>

            {formData.images.length < 5 && (
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                  <div className="flex flex-col items-center">
                    <ImageIcon />
                    <span className="mt-2 text-sm text-gray-600">Click to upload images</span>
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

            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}

            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}