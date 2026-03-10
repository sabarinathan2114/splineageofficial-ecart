import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useGetProductsQuery } from '../redux/api/productApiSlice';

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetProductsQuery();

    if (isLoading || error || !products) return null;

    const [activeIndex, setActiveIndex] = React.useState(0);
    const scrollRef = React.useRef(null);

    // Take top 6 best rated products for the banner
    const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

    // Auto-scroll logic
    React.useEffect(() => {
        const timer = setInterval(() => {
            if (scrollRef.current) {
                const nextIndex = (activeIndex + 1) % topProducts.length;
                setActiveIndex(nextIndex);
                scrollRef.current.scrollTo({
                    left: scrollRef.current.offsetWidth * nextIndex,
                    behavior: 'smooth'
                });
            }
        }, 5000);

        return () => clearInterval(timer);
    }, [activeIndex, topProducts.length]);

    const handleScroll = (e) => {
        const scrollPosition = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        const newIndex = Math.round(scrollPosition / width);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    return (
        <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[450px] overflow-hidden rounded-xl sm:rounded-[3rem] mb-8 sm:mb-12 shadow-2xl">
            {/* Simple Horizontal Scrollable Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide no-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {topProducts.map((product) => (
                    <div key={product._id} className="min-w-full h-full snap-start relative group">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-between sm:justify-end p-4 pt-5 pb-8 sm:p-16 sm:pb-16">
                            {/* Blue tag — always visible at top on mobile */}
                            <span className="inline-block self-start bg-blue-600 text-white text-[9px] sm:text-xs font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-widest shadow-lg sm:hidden">
                                Flash Deal of the Day
                            </span>
                            <div className="max-w-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="hidden sm:inline-block bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-lg">
                                    Flash Deal of the Day
                                </span>
                                <h2 className="text-xl xs:text-2xl sm:text-6xl font-black text-white mb-2 sm:mb-6 leading-tight sm:leading-none tracking-tight">
                                    {product.name}
                                </h2>
                                <p className="text-slate-200 text-xs sm:text-xl mb-4 sm:mb-10 line-clamp-2 max-w-xl font-medium opacity-90">
                                    {product.description}
                                </p>
                                <div className="flex items-center gap-4">
                                    <Link
                                        to={`/product/${product._id}`}
                                        className="bg-white text-slate-900 px-5 py-2.5 sm:px-10 sm:py-4 rounded-2xl font-black text-[10px] sm:text-base uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center group"
                                    >
                                        Shop Now <ArrowRight className="ml-2 h-3 w-3 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <div className="hidden sm:flex flex-col">
                                        <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Price starting at</span>
                                        <span className="text-white text-3xl font-black leading-none">${product.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Indicators */}
            <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-3">
                {topProducts.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setActiveIndex(i);
                            scrollRef.current.scrollTo({
                                left: scrollRef.current.offsetWidth * i,
                                behavior: 'smooth'
                            });
                        }}
                        className={`h-1 sm:h-2 rounded-full transition-all duration-500 ${i === activeIndex
                            ? 'w-5 sm:w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                            : 'w-1 sm:w-2 bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarousel;
