import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="premium-card overflow-hidden flex flex-col h-full bg-white group hover:shadow-lg transition-all duration-300">
            <Link to={`/product/${product._id}`} className="relative block">
                <div className="aspect-square overflow-hidden bg-slate-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>
                {product.countInStock === 0 && (
                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                        Out of Stock
                    </div>
                )}
                {product.price < 50 && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                        Deal
                    </div>
                )}
            </Link>

            <div className="p-2.5 sm:p-5 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-slate-900 font-bold text-xs sm:text-lg mb-1 line-clamp-1 hover:text-blue-600 transition-colors leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center mb-1.5 overflow-hidden">
                    <div className="flex items-center text-yellow-400 mr-1 shrink-0">
                        <Star className="h-2.5 w-2.5 sm:h-4 sm:w-4 fill-current" />
                        <span className="text-slate-900 text-[10px] sm:text-xs font-black ml-1">{product.rating}</span>
                    </div>
                    <span className="text-slate-400 text-[9px] sm:text-xs truncate">({product.numReviews})</span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-1 border-t border-slate-50 pt-2.5">
                    <span className="text-xs sm:text-xl font-black text-slate-900">${product.price}</span>
                    <Link
                        to={`/product/${product._id}`}
                        className="bg-slate-900 hover:bg-blue-600 text-white text-[9px] sm:text-sm font-black px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl transition-all shadow-sm shrink-0 uppercase tracking-tighter sm:tracking-normal active:scale-95"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
