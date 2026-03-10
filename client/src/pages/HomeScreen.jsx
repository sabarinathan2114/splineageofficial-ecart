import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Monitor, Shirt, ShoppingBag, Watch, Camera, Headphones, Tag } from 'lucide-react';
import { useGetProductsQuery } from '../redux/api/productApiSlice';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';

const getCategoryIcon = (category) => {
    if (!category) return <Tag className="h-5 w-5" />;
    const c = category.toString().toLowerCase();
    if (c.includes('electronic') || c.includes('laptop') || c.includes('phone') || c.includes('monitor')) return <Monitor className="h-5 w-5 text-blue-500" />;
    if (c.includes('fashion') || c.includes('shirt') || c.includes('clothing') || c.includes('apparel')) return <Shirt className="h-5 w-5 text-rose-500" />;
    if (c.includes('footwear') || c.includes('shoe')) return <ShoppingBag className="h-5 w-5 text-amber-500" />;
    if (c.includes('watch') || c.includes('accessor')) return <Watch className="h-5 w-5 text-slate-700" />;
    if (c.includes('camera') || c.includes('photo')) return <Camera className="h-5 w-5 text-purple-500" />;
    if (c.includes('headphone') || c.includes('audio') || c.includes('speaker')) return <Headphones className="h-5 w-5 text-emerald-500" />;
    return <Tag className="h-5 w-5 text-slate-400" />;
};

const HomeScreen = () => {
    const { keyword } = useParams();
    const { data: allProducts, isLoading, error } = useGetProductsQuery();

    // Fallback or specific filtered products
    const filteredProducts = keyword
        ? allProducts?.filter(p => {
            const nameMatch = p.name?.toLowerCase().includes(keyword.toLowerCase());
            const categoryStr = typeof p.category === 'object' ? p.category?.name : p.category;
            const categoryMatch = categoryStr?.toLowerCase().includes(keyword.toLowerCase());
            return nameMatch || categoryMatch;
        })
        : allProducts;

    const [recentlyViewed, setRecentlyViewed] = React.useState([]);

    React.useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(viewed);
    }, []);

    const categories = allProducts
        ? [...new Set(allProducts.map((p) => (typeof p.category === 'object' ? p.category?.name : p.category)))]
        : [];
    const topRated = allProducts ? [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 4) : [];
    const cheapDeals = allProducts ? allProducts.filter((p) => p.price < 100).slice(0, 4) : [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Loading premium products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                <p className="text-slate-600">{error?.data?.message || error.error}</p>
            </div>
        );
    }

    return (
        <>
            {!keyword && <ProductCarousel />}

            {keyword && (
                <Link to="/" className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mb-6 group">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                </Link>
            )}

            {/* Categories Scroll */}
            {!keyword && categories.length > 0 && (
                <div className="flex overflow-x-auto gap-2.5 sm:gap-3 pb-6 sm:pb-8 scrollbar-hide no-scrollbar -mx-4 px-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            to={`/search/${cat}`}
                            className="shrink-0 bg-white border border-slate-200 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-xs font-black uppercase tracking-widest text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm flex flex-col items-center gap-1 min-w-[60px] sm:min-w-[80px]"
                        >
                            <span className="[&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6 [&>svg]:mr-0">{getCategoryIcon(cat)}</span>
                            {cat}
                        </Link>
                    ))}
                </div>
            )}

            {/* Recently Viewed */}
            {!keyword && recentlyViewed.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-300 pl-4 leading-none">
                            Picked for <span className="text-blue-600">You</span>
                        </h2>
                        <button
                            onClick={() => { localStorage.removeItem('recentlyViewed'); setRecentlyViewed([]); }}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 opacity-90">
                        {recentlyViewed.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2 sm:mb-4 tracking-tighter sm:tracking-tight">
                    {keyword ? (
                        <>Search results for "<span className="text-blue-600">{keyword}</span>"</>
                    ) : (
                        <>Latest <span className="text-blue-600">Arrivals</span></>
                    )}
                </h1>
                <p className="text-slate-500 max-w-2xl text-sm sm:text-lg font-medium">
                    {keyword
                        ? filteredProducts.length > 0
                            ? `Found ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} matching your search.`
                            : "No products found matching your search. Browse our full collection below:"
                        : 'Explore our handpicked collection of premium products designed for quality and style.'
                    }
                </p>
            </div>

            {keyword && filteredProducts.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 mb-16">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            {!keyword && topRated.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-blue-600 pl-4 leading-none">
                            Today's <span className="text-blue-600">Top Picks</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                        {topRated.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {!keyword && cheapDeals.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-emerald-500 pl-4 leading-none">
                            Hot <span className="text-emerald-600">Deals</span>
                        </h2>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs font-black px-3 py-2 rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm">
                            Limited Time
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                        {cheapDeals.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Full Collection Section - Shows if no keyword, OR if keyword results are 0 */}
            {(!keyword || (keyword && filteredProducts.length === 0)) && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-slate-900 pl-4 leading-none flex items-center">
                            OUR <span className="text-blue-600 ml-2">FULL COLLECTION</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                        {allProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeScreen;
