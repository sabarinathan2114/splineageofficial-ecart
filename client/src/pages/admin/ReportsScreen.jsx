import React, { useState } from 'react';
import {
    Download,
    ChevronDown,
    ArrowUpRight,
    TrendingUp,
    Package,
    Truck,
    PieChart,
    RotateCcw,
    Calendar,
    Loader2,
    Search,
    Filter,
    X,
    Tag,
    BarChart3
} from 'lucide-react';
import { useGetSellerDashboardStatsQuery } from '../../redux/api/ordersApiSlice';
import { useGetCategoriesQuery } from '../../redux/api/productApiSlice';

const DonutChart = ({ data, colors, size = 240, strokeWidth = 50, centerLabel, centerSublabel }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                {data.map((item, index) => {
                    const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedOffset;
                    accumulatedOffset += (item.value / 100) * circumference;

                    return (
                        <circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke={colors[index]}
                            strokeWidth={strokeWidth}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-[55px] shadow-inner">
                <span className="text-2xl font-black text-slate-900 leading-none">{centerLabel}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{centerSublabel}</span>
            </div>
        </div>
    );
};

const ProductsPerformance = ({ topProducts }) => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">PRODUCT PERFORMANCE</h2>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-50">
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">PRODUCT NAME</th>
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">UNITS</th>
                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">REVENUE</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {topProducts && topProducts.length > 0 ? topProducts.map((p, i) => (
                        <tr key={p._id || i} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 flex items-center gap-3">
                                {p.image && <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />}
                                <span className="text-xs font-bold text-slate-700">{p.name}</span>
                            </td>
                            <td className="py-3 text-xs font-bold text-slate-900 text-center">{p.totalSold}</td>
                            <td className="py-3 text-xs font-black text-indigo-600 text-right tracking-tight">
                                ₹{p.revenue.toLocaleString()}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" className="py-10 text-center text-slate-400 font-medium">No product data available for this period.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const ReportsScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data: stats, isLoading, error } = useGetSellerDashboardStatsQuery();
    const { data: categories } = useGetCategoriesQuery();

    const selectedCategoryName = categoryFilter === 'all'
        ? 'All Categories'
        : categories?.find(c => c._id === categoryFilter)?.name || 'All Categories';

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10">
                <p className="text-slate-500 font-bold mb-4">Error loading reports: {error?.data?.message || error.error}</p>
            </div>
        );
    }

    const { topProducts } = stats || {};

    const filteredProducts = topProducts?.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter || p.category?._id === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1">Reports Hub</p>
                    <h1 className="text-[32px] font-black text-slate-900 tracking-tight">Performance Analytics</h1>
                    <p className="text-slate-500 font-medium">Analyze your product performance and sales data.</p>
                </div>
            </div>

            {/* Refined Unified Controls */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm mb-10 flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        className="w-full bg-transparent py-4 pl-14 pr-6 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 px-4 border-l border-slate-50">
                    <BarChart3 className="w-10 h-10 text-blue-600" /> {/* Added BarChart3 */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 bg-slate-50 rounded-2xl py-2.5 px-5 text-[11px] font-black uppercase tracking-wider text-slate-700 transition-all hover:bg-slate-100"
                        >
                            {selectedCategoryName}
                            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            setCategoryFilter('all');
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${categoryFilter === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories?.map(c => (
                                        <button
                                            key={c._id}
                                            onClick={() => {
                                                setCategoryFilter(c._id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${categoryFilter === c._id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 min-h-[600px] relative overflow-hidden">
                <ProductsPerformance topProducts={filteredProducts} />
            </div>
        </div>
    );
};

export default ReportsScreen;
