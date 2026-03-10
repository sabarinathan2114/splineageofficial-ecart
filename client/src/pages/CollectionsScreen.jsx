import React from 'react';
import { useGetProductsQuery } from '../redux/api/productApiSlice';
import ProductCard from '../components/ProductCard';
import { Loader2, AlertCircle, ShoppingBag, Filter, SlidersHorizontal } from 'lucide-react';

const CollectionsScreen = () => {
    const { data: products, isLoading, error } = useGetProductsQuery();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Loading our premium collections...</p>
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
        <div className="py-8">
            <div className="mb-12">
                <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Official Catalog</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter sm:tracking-tight mb-4">
                            Full <span className="text-blue-600">Collections</span>
                        </h1>
                        <p className="text-slate-500 max-w-2xl text-lg font-medium leading-relaxed">
                            Browse through our complete list of premium products, curated for quality and timeless style.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                            <ShoppingBag className="h-5 w-5 text-blue-600 mr-3" />
                            <span className="text-slate-900 font-black text-xl">{products.length}</span>
                            <span className="ml-2 text-slate-400 text-xs font-bold uppercase tracking-widest">Items</span>
                        </div>
                    </div>
                </div>

                {/* Filter Placeholder UI */}
                <div className="flex flex-wrap items-center gap-4 mb-12">
                    <button className="flex items-center bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                        <SlidersHorizontal className="h-4 w-4 mr-3 text-blue-400" />
                        Sort: Featured
                    </button>
                    <button className="flex items-center bg-white border border-slate-200 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                        <Filter className="h-4 w-4 mr-3" />
                        All Categories
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Products Found</h3>
                    <p className="text-slate-500 font-medium">We couldn't find any products in our collections right now.</p>
                </div>
            )}
        </div>
    );
};

export default CollectionsScreen;
