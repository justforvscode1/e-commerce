// app/product/[id]/page.js
'use client';
import { use, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
// Loading Component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    </div>
  );
}


function getFirstVariant(product) {
  if (!product.variants || product.variants.length === 0) return null;
  return product.variants[0];
}
function getAvailableAttributes(variants) {
  const attributes = {};
  variants.forEach(variant => {
    if (variant.attributes) {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!attributes[key]) {
          attributes[key] = new Set();
        }
        attributes[key].add(value);
      });
    }
  });

  const result = {};
  Object.keys(attributes).forEach(key => {
    result[key] = Array.from(attributes[key]);
  });
  return result;
}
function findVariantByAttributes(variants, selectedAttributes) {
  return variants.find(variant => {
    if (!variant.attributes) return false;

    for (const [key, value] of Object.entries(selectedAttributes)) {
      if (variant.attributes[key] !== value) {
        return false;
      }
    }

    if (Object.keys(variant.attributes).length !== Object.keys(selectedAttributes).length) {
      return false;
    }

    return true;
  });
}
function isCombinationAvailable(variants, attributes) {
  return variants.some(variant => {
    if (!variant.attributes) return false;

    for (const [key, value] of Object.entries(attributes)) {
      if (variant.attributes[key] !== value) {
        return false;
      }
    }

    return Object.keys(variant.attributes).length === Object.keys(attributes).length;
  });
}
function isAttributeValueAvailable(variants, attributeType, value) {
  return variants.some(variant => {
    if (!variant.attributes) return false;
    return variant.attributes[attributeType] === value;
  });
}
function getAvailableOptions(variants, attributeType, currentAttributes) {
  const availableOptions = new Set();

  variants.forEach(variant => {
    if (!variant.attributes) return;

    // Check if this variant matches all currently selected attributes except the one we're checking
    let matches = true;
    for (const [key, value] of Object.entries(currentAttributes)) {
      if (key !== attributeType && variant.attributes[key] !== value) {
        matches = false;
        break;
      }
    }

    if (matches && variant.attributes[attributeType]) {
      availableOptions.add(variant.attributes[attributeType]);
    }
  });

  return Array.from(availableOptions);
}

export default function ProductPage({ params }) {
  const { data, status } = useSession()
  const router = useRouter();
  const id = decodeURIComponent(use(params).id);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [pictureno, setPictureNo] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableAttributes, setAvailableAttributes] = useState({});
  const [CombinationError, setCombinationError] = useState('')

  // Get product data
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setCombinationError('');

        const response = await fetch(`/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const allProducts = await response.json();
        const productData = allProducts.find(item => item.productid === id);

        if (!productData) {
          setError('Product not found');
          return;
        }

        setProduct(productData);

        const attributes = getAvailableAttributes(productData.variants);
        setAvailableAttributes(attributes);

        const firstVariant = getFirstVariant(productData);
        if (firstVariant && firstVariant.attributes) {
          const initialAttributes = {};
          Object.entries(firstVariant.attributes).forEach(([key, value]) => {
            initialAttributes[key] = value;
          });
          setSelectedAttributes(initialAttributes);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);
  function ErrorScreen({ message, onRetry }) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="space-x-4">

            <button onClick={router.back} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Go back
            </button>

            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  // Handle attribute selection - allow any value to be clickable
  const handleAttributeChange = (attributeType, value) => {
    setCombinationError('');

    // Try to update with just the selected attribute
    let newAttributes = { ...selectedAttributes, [attributeType]: value };

    // Check if this combination exists
    if (!isCombinationAvailable(product.variants, newAttributes)) {
      // Combination not available - find ANY available variant and switch to it
      if (product.variants && product.variants.length > 0) {
        const firstAvailableVariant = product.variants[0];
        if (firstAvailableVariant && firstAvailableVariant.attributes) {
          newAttributes = { ...firstAvailableVariant.attributes };
        }
      }
    }

    setSelectedAttributes(newAttributes);
    setPictureNo(0);
  };

  // Get current selected variant data
  const getSelectedVariant = () => {
    if (!product || !product.variants) return null;
    return findVariantByAttributes(product.variants, selectedAttributes);
  };

  // Get available options for an attribute based on current selection
  const getFilteredOptions = (attributeType) => {
    if (!product || !product.variants) return [];
    return getAvailableOptions(product.variants, attributeType, selectedAttributes);
  };

  // Check if current combination is valid (in stock)
  const isCombinationValid = !!getSelectedVariant();

  // Retry loading product
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setCombinationError('');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Show error screen
  if (error) {
    return <ErrorScreen message={error} onRetry={handleRetry} />;
  }

  if (!product) {
    return <ErrorScreen message="The product you're looking for doesn't exist." onRetry={handleRetry} />;
  }

  const selectedVariant = getSelectedVariant();
  const images = selectedVariant?.images || [];
  const price = selectedVariant?.price || 0;
  const salePrice = selectedVariant?.salePrice;
  const stockCount = selectedVariant?.stockCount || 0;
  const displayPrice = salePrice || price;
  const isOnSale = !!salePrice;

  const addingtocart = async () => {
    const productdata = {
      productId: product.productid,
      userId: data?.user?.id,
      name: product.name,
      brand: product.brand,
      image: images[0],
      price,
      quantity,
      stockCount,
      selectedVariant: selectedAttributes,
      salePrice,
    }
    const sendingcartproduct = await fetch(`/api/cart/${data.user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productdata)
    })
    const response = await sendingcartproduct.json()
    console.log(response)
    if (response.error === "product already in the cart") {
      toast.info('product is already in cart', {
        position: "top-center"
      })
    } else if (response.message === "sucessfully added in the cart") {
      toast.success("product added in cart", {
        position: "top-center"
      })
    } else {
      toast.error("error adding in cart", {
        position: "top-center"
      })
    }
  }
  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Product Images - Left Side */}
            <div className="space-y-6">
              <div className="aspect-square bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group relative">
                {images.length > 0 ? (
                  <Image src={images[pictureno]} alt={`Product Image ${pictureno + 1}`} width={500} height={500} className="w-full h-150 bg-gradient-to-br from-gray-100 to-gray-200" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">No Image Available</span>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => pictureno >= 1 && setPictureNo(p => p - 1)}
                      disabled={pictureno === 0}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => pictureno < images.length - 1 && setPictureNo(p => p + 1)}
                      disabled={pictureno === images.length - 1}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPictureNo(idx)}
                      className={`aspect-square bg-white rounded-xl shadow-md border-2 overflow-hidden transition-all duration-300 ${pictureno === idx
                        ? 'border-blue-500 ring-2 ring-blue-200 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                        }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info - Right Side with Better Padding */}
            <div className="lg:pl-8 space-y-8">


              {/* Brand */}
              {product.brand && (
                <div className="text-lg font-semibold text-blue-600 mb-2">
                  {product.brand}
                </div>
              )}

              {/* Title & Price */}
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {isCombinationValid ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-blue-600">${displayPrice}</span>
                    {isOnSale && (
                      <>
                        <span className="text-xl text-gray-500 line-through">${price}</span>
                        <span className="text-sm font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                          {Math.round((1 - salePrice / price) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">Select available options to see price</div>
                )}

                {/* Stock status */}
                {isCombinationValid && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${stockCount > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${stockCount > 0 ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                    {stockCount > 0 ? `${stockCount} in Stock` : 'Out of Stock'}
                  </div>
                )}
              </div>



              {/* Variant Selectors */}
              {Object.keys(availableAttributes).length > 0 && (
                <div className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Options</h3>
                  {Object.entries(availableAttributes).map(([attributeType, allValues]) => {
                    const availableOptions = getFilteredOptions(attributeType);

                    return (
                      <div key={attributeType} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold text-gray-700 capitalize">
                            {attributeType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {allValues.map(value => {
                            const isSelected = selectedAttributes[attributeType] === value;
                            const isAvailableWithCurrent = availableOptions.includes(value);

                            return (
                              <button
                                key={value}
                                onClick={() => handleAttributeChange(attributeType, value)}
                                className={`px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 relative ${isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                                  : isAvailableWithCurrent
                                    ? 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-105'
                                    : 'bg-gray-100 border-gray-300 text-gray-600 opacity-70 hover:bg-gray-150 hover:border-gray-400 hover:scale-105'
                                  }`}
                                title={!isAvailableWithCurrent ? 'Not available with current selection' : ''}
                              >
                                {value}
                                {!isAvailableWithCurrent && !isSelected && (
                                  <span className="ml-2 text-xs inline-block">⊘</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
                {/* Quantity Selector */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || !isCombinationValid}
                      className="w-14 h-14 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-20 text-center font-bold text-2xl bg-gray-50 py-4 rounded-xl border-2 border-gray-200">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(stockCount, q + 1))}
                      disabled={quantity >= stockCount || !isCombinationValid}
                      className="w-14 h-14 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  {isCombinationValid && stockCount > 0 && stockCount <= 10 && (
                    <div className="text-center text-orange-600 text-sm font-medium bg-orange-50 py-2 px-4 rounded-lg">
                      ⚡ Only {stockCount} left in stock - order soon!
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={addingtocart}
                  disabled={isAddingToCart || stockCount === 0 || !isCombinationValid}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:hover:scale-100 disabled:cursor-not-allowed shadow-xl text-lg"
                >
                  {isAddingToCart ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Cart...
                    </span>
                  ) : stockCount === 0 ? (
                    'Out of Stock'
                  ) : !isCombinationValid ? (
                    'Select Available Options'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
              {/* Description */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
              </div>

              {/* Quantity & Add to Cart */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}