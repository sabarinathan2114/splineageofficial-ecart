import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, ArrowLeft, Star, ChevronRight, ChevronLeft, Check, Zap, MessageSquare, Plus, Minus, X, Upload } from 'lucide-react';
import { useGetProductDetailsQuery, useGetRelatedProductsQuery, useCreateReviewMutation, useUploadProductImageMutation } from '../redux/api/productApiSlice';
import { addToCart, setBuyNowItem, clearBuyNowItem } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const [qty, setQty] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // Review states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [uploadImages, setUploadImages] = useState([]);
    const [lightbox, setLightbox] = useState({ isOpen: false, images: [], index: 0 });
    const [activeTab, setActiveTab] = useState('overview');
    const [visibleReviews, setVisibleReviews] = useState(2);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);

    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    const { data: relatedProducts, isLoading: loadingRelated } = useGetRelatedProductsQuery(productId);

    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    React.useEffect(() => {
        if (product) {
            const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const updated = [product, ...recentlyViewed.filter(p => p._id !== product._id)].slice(0, 4);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        } else if (error && (error.status === 404 || error?.data?.message === 'Product not found')) {
            // Remove from recently viewed if it no longer exists
            const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const updated = recentlyViewed.filter(p => p._id !== productId);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        }
    }, [product, error, productId]);

    const addToCartHandler = () => {
        dispatch(clearBuyNowItem());
        dispatch(addToCart({ ...product, qty }));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const buyNowHandler = () => {
        dispatch(setBuyNowItem({ ...product, qty }));
        navigate('/shipping');
    };

    const uploadFileHandler = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await uploadProductImage(formData).unwrap();
                return res.image;
            } catch (err) {
                toast.error(`Error uploading ${file.name}: ${err?.data?.message || err.error}`);
                return null;
            }
        });

        const uploadedImages = await Promise.all(uploadPromises);
        const validImages = uploadedImages.filter(img => img !== null);

        if (validImages.length > 0) {
            setUploadImages(prev => [...prev, ...validImages]);
            toast.success(`Successfully uploaded ${validImages.length} image(s)`);
        }
    };

    const timeAgo = (date) => {
        if (!date) return "Just now";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "Recently";

        const seconds = Math.floor((new Date() - d) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
        interval = seconds / 604800;
        if (interval > 1) return Math.floor(interval) + " week" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minute" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
        return Math.floor(seconds) + " second" + (Math.floor(seconds) !== 1 ? "s" : "") + " ago";
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating parameter.');
            return;
        }

        try {
            await createReview({
                productId,
                rating,
                comment,
                photos: uploadImages,
            }).unwrap();
            refetch();
            toast.success('Review Submitted Successfully');
            setRating(0);
            setComment('');
            setUploadImages([]);
            setShowReviewModal(false);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const openLightbox = (images, index) => {
        setLightbox({ isOpen: true, images, index });
    };

    const closeLightbox = () => {
        setLightbox(prev => ({ ...prev, isOpen: false }));
    };

    const nextImage = (e) => {
        if (e) e.stopPropagation();
        setLightbox(prev => ({
            ...prev,
            index: (prev.index + 1) % prev.images.length
        }));
    };

    const prevImage = (e) => {
        if (e) e.stopPropagation();
        setLightbox(prev => ({
            ...prev,
            index: (prev.index - 1 + prev.images.length) % prev.images.length
        }));
    };

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightbox.isOpen) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightbox.isOpen, lightbox.index]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <h3 className="text-red-500 font-bold">Error: {error?.data?.message || 'Something went wrong'}</h3>
                <Link to="/" className="text-blue-600 underline mt-4 inline-block">Go Back</Link>
            </div>
        );
    }

    return (
        <>
            <Link
                to="/"
                className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-2 sm:mb-8 group text-xs sm:text-sm"
            >
                <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Results
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 lg:gap-16">
                <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">
                    {/* Product Image */}
                    <div className="rounded-3xl overflow-hidden glass p-2 sm:p-4 aspect-square">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-2xl shadow-sm"
                        />
                    </div>


                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <div>
                        <span className="text-blue-600 text-[8px] sm:text-sm font-bold tracking-widest uppercase mb-1 sm:mb-2 block">
                            {product.category?.name || product.category}
                        </span>
                        <h1 className="text-lg sm:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-4 leading-tight">{product.name}</h1>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-slate-400 text-xs sm:text-sm font-medium">
                                {product.numReviews} Verified Reviews
                            </span>
                        </div>

                        <p className="text-xl sm:text-3xl font-black text-slate-900 mb-3 sm:mb-6 tracking-tight">${product.price}</p>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-slate-200 mb-5 sm:mb-6 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`pb-4 px-4 sm:px-8 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-4 px-4 sm:px-8 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                Reviews ({product.numReviews})
                            </button>
                        </div>

                        {activeTab === 'overview' ? (
                            <p className="text-slate-600 leading-relaxed text-sm sm:text-lg animate-in fade-in slide-in-from-left-4 duration-300 mb-5">
                                {product.description}
                            </p>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm sm:text-lg font-black text-slate-900 uppercase tracking-wider">Customer Experience</h3>
                                    <button
                                        onClick={() => setShowReviewModal(true)}
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-widest uppercase transition-all shadow-md rounded-xl py-2 px-3 sm:px-4 flex items-center hover:-translate-y-0.5 text-[10px] sm:text-xs"
                                    >
                                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Write Review
                                    </button>
                                </div>

                                {product.reviews.length === 0 ? (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-slate-500 text-[10px] sm:text-xs font-medium">
                                        No reviews yet. Share your thoughts!
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {[...product.reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, visibleReviews).map((review) => (
                                            <div key={review._id} className="bg-white p-3 sm:p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4">
                                                <div className="flex-grow min-w-0">
                                                    <div className="mb-1">
                                                        <strong className="text-slate-900 font-bold tracking-tight text-[10px] sm:text-xs leading-none">{review.name}</strong>
                                                        <div className="flex items-center mt-1 text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-600 text-[10px] sm:text-xs italic leading-tight line-clamp-2">"{review.comment}"</p>
                                                </div>

                                                <div className="flex-shrink-0 flex flex-col items-end gap-2 self-center">
                                                    <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">{timeAgo(review.createdAt)}</span>
                                                    {review.photos && review.photos.length > 0 && (
                                                        <div className="flex gap-1.5">
                                                            {review.photos.slice(0, 2).map((photo, i) => (
                                                                <div key={i} className="relative cursor-pointer group" onClick={() => openLightbox(review.photos, i)}>
                                                                    <img src={photo} alt={`r-${i}`} className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover border border-slate-50 shadow-sm transition-transform active:scale-95" />
                                                                    {i === 1 && review.photos.length > 2 && (
                                                                        <div className="absolute inset-0 bg-slate-900/40 rounded-lg flex items-center justify-center backdrop-blur-[1px]">
                                                                            <span className="text-white font-black text-[8px]">+{review.photos.length - 2}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex gap-4 pt-2">
                                            {product.reviews.length > visibleReviews && (
                                                <button
                                                    onClick={() => setVisibleReviews(prev => prev + 2)}
                                                    className="flex items-center gap-1 group transition-all"
                                                >
                                                    <span className="text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest border-b border-transparent group-hover:border-blue-600">
                                                        View {product.numReviews - visibleReviews} more
                                                    </span>
                                                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            )}

                                            {visibleReviews > 2 && (
                                                <button
                                                    onClick={() => setVisibleReviews(2)}
                                                    className="flex items-center gap-1 group transition-all"
                                                >
                                                    <span className="text-[10px] sm:text-xs font-black text-rose-600 uppercase tracking-widest border-b border-transparent group-hover:border-rose-600">
                                                        View Less
                                                    </span>
                                                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-rose-600 group-hover:scale-110 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="premium-card p-3 sm:p-5 bg-white border-slate-200 mb-6 sm:mb-12">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <span className="text-slate-600 font-medium text-sm sm:text-base">Price</span>
                                <span className="text-slate-900 font-bold text-sm sm:text-base">${product.price}</span>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                <span className="text-slate-600 font-medium text-sm sm:text-base">Status</span>
                                <span className={`font-bold text-sm sm:text-base ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {product.countInStock > 0 ? (
                                        <span className="flex items-center">
                                            <Check className="h-4 w-4 mr-1" /> In Stock
                                        </span>
                                    ) : (
                                        'Out of Stock'
                                    )}
                                </span>
                            </div>

                            {product.countInStock > 0 && (
                                <div className="flex items-center justify-between py-3 border-b border-slate-100 mb-5">
                                    <span className="text-slate-600 font-medium text-sm sm:text-base">Quantity</span>
                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-sm">
                                        <button
                                            onClick={() => setQty(prev => Math.max(1, prev - 1))}
                                            disabled={qty <= 1}
                                            className="p-1.5 sm:p-2 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 text-slate-500 transition-all active:scale-90"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 sm:w-10 text-center font-black text-slate-900 text-sm sm:text-lg select-none">{qty}</span>
                                        <button
                                            onClick={() => setQty(prev => Math.min(product.countInStock, prev + 1))}
                                            disabled={qty >= product.countInStock}
                                            className="p-1.5 sm:p-2 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 text-slate-500 transition-all active:scale-90"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={addToCartHandler}
                                    disabled={product.countInStock === 0}
                                    className={`flex-1 flex items-center justify-center py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md ${product.countInStock > 0
                                        ? addedToCart ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-200 active:scale-95'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {addedToCart ? (
                                        <>
                                            <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                            Added!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={buyNowHandler}
                                    disabled={product.countInStock === 0}
                                    className={`flex-1 flex items-center justify-center py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md ${product.countInStock > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 fill-current" />
                                    <span className="whitespace-nowrap">Buy Now</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Modal Overlay Component here  */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">

                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wider">Leave a Review</h3>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
                            {loadingProductReview && (
                                <div className="text-center py-4 mb-4 text-blue-600">
                                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            )}

                            {userInfo ? (
                                <form onSubmit={submitHandler} className="space-y-6">
                                    {/* Interactive Star Picker */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">Overall Rating</label>
                                        <div className="flex items-center space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-slate-200 hover:text-yellow-200'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-3 text-sm font-semibold text-slate-500">
                                                {rating === 1 && 'Poor'}
                                                {rating === 2 && 'Fair'}
                                                {rating === 3 && 'Good'}
                                                {rating === 4 && 'Very Good'}
                                                {rating === 5 && 'Excellent!'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="comment" className="block text-[10px] sm:text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">Detailed Review</label>
                                        <textarea
                                            id="comment"
                                            rows="3"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm sm:text-base font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm resize-none"
                                            placeholder="What did you think about this product?"
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">Upload Photos (Optional)</label>
                                        <div className="flex flex-col space-y-3">
                                            <label className="flex items-center justify-center w-full px-4 py-3 bg-white text-blue-600 rounded-xl shadow-sm tracking-wide font-bold border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors uppercase text-xs">
                                                <Upload className="h-4 w-4 mr-2" />
                                                {loadingUpload ? 'Uploading...' : 'Choose File'}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={uploadFileHandler}
                                                    accept="image/*"
                                                    multiple
                                                />
                                            </label>

                                            {/* Render currently uploaded mockups */}
                                            {uploadImages.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {uploadImages.map((img, index) => (
                                                        <div key={index} className="relative group rounded-md overflow-hidden border border-slate-200">
                                                            <img src={img} alt="review upload" className="h-16 w-16 object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setUploadImages(uploadImages.filter((_, i) => i !== index))}
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <button
                                            disabled={loadingProductReview || loadingUpload}
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold tracking-widest uppercase transition-all shadow-lg shadow-blue-500/30 rounded-xl py-3 sm:py-4 flex justify-center items-center hover:-translate-y-0.5 text-sm sm:text-base"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                                    <p className="text-blue-800 font-medium mb-4">You must be logged in to write a review.</p>
                                    <Link to={`/login?redirect=/product/${productId}`} className="inline-block bg-blue-600 text-white hover:bg-blue-700 font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-lg text-sm">
                                        Login Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            {lightbox.isOpen && (
                <div
                    className="fixed inset-0 z-[110] bg-slate-950/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300 backdrop-blur-md"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-blue-400 transition-all bg-white/5 hover:bg-white/10 p-3 rounded-full backdrop-blur-xl z-20 border border-white/10"
                        onClick={closeLightbox}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                        {lightbox.images.length > 1 && (
                            <button
                                className="absolute left-0 sm:-left-20 text-white hover:text-blue-400 p-4 rounded-full transition-all bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 z-20"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                        )}

                        <div className="relative group w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={lightbox.images[lightbox.index]}
                                alt="Full size review"
                                className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 select-none ring-1 ring-white/10"
                            />

                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full backdrop-blur-md border border-white/5 shadow-xl">
                                <span className="text-white/40 font-black text-[10px] tracking-widest uppercase">Photo</span>
                                <span className="text-white font-black text-sm">{lightbox.index + 1} / {lightbox.images.length}</span>
                            </div>
                        </div>

                        {lightbox.images.length > 1 && (
                            <button
                                className="absolute right-0 sm:-right-20 text-white hover:text-blue-400 p-4 rounded-full transition-all bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 z-20"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="mt-12 sm:mt-24 mb-10 sm:mb-16">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-3xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4 leading-none">
                            Related <span className="text-blue-600">Products</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-8">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductScreen;
