import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { useGetProductsQuery } from '../redux/api/productApiSlice';

const SearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    const { data: products, isLoading } = useGetProductsQuery(keyword, {
        skip: keyword.trim().length === 0,
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full max-w-md" ref={searchRef}>
            <form onSubmit={submitHandler} className="relative group">
                <input
                    type="text"
                    name="q"
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setShowSuggestions(true);
                    }}
                    value={keyword}
                    placeholder="Search products..."
                    className="w-full bg-slate-800 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-white placeholder-slate-400 group-hover:bg-slate-700"
                />
                <div className="absolute right-3 top-2.5 flex items-center space-x-2">
                    {keyword && (
                        <button
                            type="button"
                            onClick={() => {
                                setKeyword('');
                                navigate('/');
                            }}
                            className="text-slate-400 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    <button type="submit">
                        <Search className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </button>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && keyword.trim().length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center text-slate-400 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Searching...
                        </div>
                    ) : products && products.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto py-2">
                            <p className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Suggestions
                            </p>
                            {products.slice(0, 5).map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    onClick={() => setShowSuggestions(false)}
                                    className="flex items-center px-4 py-3 hover:bg-slate-700 transition-colors"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-lg object-cover mr-3 bg-white"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white line-clamp-1">
                                            {product.name}
                                        </span>
                                        <span className="text-xs text-blue-400 font-bold">
                                            ${product.price}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            <div
                                onClick={submitHandler}
                                className="px-4 py-3 border-t border-slate-700 text-center cursor-pointer hover:bg-slate-700"
                            >
                                <span className="text-sm text-slate-400 font-medium">
                                    View all results for "{keyword}"
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-slate-400 text-sm text-center font-medium">
                            No products found for "{keyword}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBox;
