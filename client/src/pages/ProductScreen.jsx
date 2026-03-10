import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, ArrowLeft, Star, ChevronRight, Check, Zap } from 'lucide-react';
import { useGetProductDetailsQuery, useGetRelatedProductsQuery } from '../redux/api/productApiSlice';
import { addToCart, setBuyNowItem, clearBuyNowItem } from '../redux/slices/cartSlice';
import ProductCard from '../components/ProductCard';

const ProductScreen = () => {
    const { id: productId } = useParams();
    const [qty, setQty] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
    const { data: relatedProducts, isLoading: loadingRelated } = useGetRelatedProductsQuery(productId);

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
                className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
            >
                <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Results
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* Product Image */}
                <div className="rounded-3xl overflow-hidden glass p-4 aspect-square">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-2xl shadow-sm"
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <span className="text-blue-600 text-sm font-bold tracking-widest uppercase mb-2 block">
                            {product.category?.name || product.category}
                        </span>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-slate-400 text-sm font-medium">
                                {product.numReviews} Verified Reviews
                            </span>
                        </div>

                        <p className="text-3xl font-bold text-slate-900 mb-6">${product.price}</p>
                        <p className="text-slate-600 leading-relaxed text-lg mb-8">
                            {product.description}
                        </p>
                    </div>

                    <div className="premium-card p-6 bg-white border-slate-200">
                        <div className="flex items-center justify-between py-4 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">Price</span>
                            <span className="text-slate-900 font-bold">${product.price}</span>
                        </div>

                        <div className="flex items-center justify-between py-4 border-b border-slate-100">
                            <span className="text-slate-600 font-medium">Status</span>
                            <span className={`font-bold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
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
                            <div className="flex items-center justify-between py-4 border-b border-slate-100 mb-6">
                                <span className="text-slate-600 font-medium">Quantity</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {[...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={addToCartHandler}
                                disabled={product.countInStock === 0}
                                className={`flex-1 flex items-center justify-center py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${product.countInStock > 0
                                    ? addedToCart ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-200 active:scale-95'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="h-6 w-6 mr-2" />
                                        Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-6 w-6 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <button
                                onClick={buyNowHandler}
                                disabled={product.countInStock === 0}
                                className={`flex-1 flex items-center justify-center py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${product.countInStock > 0
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Zap className="h-6 w-6 mr-2 fill-current" />
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="mt-24 mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4 leading-none">
                            Related <span className="text-blue-600">Products</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
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
