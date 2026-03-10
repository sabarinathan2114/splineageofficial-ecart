import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetCategoriesQuery
} from '../../redux/api/productApiSlice';
import {
    Package,
    Plus,
    Edit,
    Filter,
    ChevronDown,
    Trash2,
    ExternalLink,
    TrendingUp,
    ShoppingBag,
    CheckCircle2,
    HelpCircle,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const SellerScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [showGuide, setShowGuide] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const { data: categories } = useGetCategoriesQuery();

    const selectedCategoryName = categoryFilter === 'all'
        ? 'All Categories'
        : categories?.find(c => c._id === categoryFilter)?.name || 'All Categories';
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    // Filter products for this seller specifically
    const myProducts = products?.filter(p => {
        const isSellerProduct = (p.user?._id || p.user) === userInfo._id;
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter || p.category?._id === categoryFilter;
        return isSellerProduct && matchesCategory;
    }) || [];

    const createProductHandler = async () => {
        try {
            const res = await createProduct().unwrap();
            navigate(`/seller/product/${res._id}/edit`);
            toast.success('Draft product created');
        } catch (err) {
            console.error(err);
            toast.error(err?.data?.message || err.error || 'Failed to create product');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Remove this product from your store?')) {
            try {
                await deleteProduct(id).unwrap();
                refetch();
                toast.success('Product removed');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const guideSteps = [
        { title: 'Create Draft', desc: 'Click "Add New Product" to generate a sample item template.', icon: Plus },
        { title: 'Fill & Edit', desc: 'Provide a catchy name, price, and clear image URL for your item.', icon: Edit },
        { title: 'Set Stocks', desc: 'Specify how many units you have in stock to prevent overselling.', icon: Package },
        { title: 'Go Live', desc: 'Save your changes, and your product instantly appears on the Home Screen!', icon: CheckCircle2 },
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-[40px] font-black text-slate-900 tracking-tight mb-2">Seller Hub</h1>
                    <p className="text-slate-500 font-medium">Empowering your business journey.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowGuide(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-100 bg-white"
                    >
                        <HelpCircle className="w-3.5 h-3.5" />
                        How to Sell?
                    </button>
                    <button
                        onClick={createProductHandler}
                        disabled={loadingCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[12px] font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loadingCreate ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Plus className="w-3.5 h-3.5" />
                        )}
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative mb-10 w-max">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl py-3 px-6 text-[11px] font-black uppercase tracking-wider text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                >
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCategoryName}
                    <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsDropdownOpen(false)}
                        />
                        <div className="absolute left-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
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
                                All Products
                            </button>
                            {categories?.map(category => (
                                <button
                                    key={category._id}
                                    onClick={() => {
                                        setCategoryFilter(category._id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${categoryFilter === category._id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Products Count Info */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-black text-blue-900 uppercase tracking-widest">
                        MY PRODUCTS ({myProducts.length})
                    </span>
                </div>
            </div>

            {showGuide && (
                <div className="mb-12 relative">
                    <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        {guideSteps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex-1 w-full premium-card bg-white border-2 border-blue-100 p-6 rounded-[24px] relative group hover:border-blue-400 transition-all hover:shadow-2xl hover:shadow-blue-200/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <step.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-black text-blue-200 group-hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Step 0{index + 1}</span>
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">{step.title}</h4>
                                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{step.desc}</p>
                                </div>
                                {index < guideSteps.length - 1 && (
                                    <div className="hidden md:flex items-center justify-center text-blue-200">
                                        <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {loadingCreate && <Loader />}
            {loadingDelete && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.error || 'Failed to load products'}</Message>
            ) : myProducts.length === 0 ? (
                <div className="premium-card bg-white p-8">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-6 bg-slate-50 rounded-full mb-6">
                            <Package className="h-16 w-16 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Your store is empty</h3>
                        <p className="text-slate-600 max-w-sm mb-8 font-bold leading-relaxed">
                            Start selling by adding your first product.
                            Everything you add here will be visible on the Collections page.
                        </p>
                        <button
                            onClick={createProductHandler}
                            className="bg-slate-900 text-white font-black px-8 py-3 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center"
                        >
                            Get Started Now <ArrowRight className="h-4 w-4 ml-2" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {myProducts.map((product) => (
                        <div key={product._id} className="premium-card bg-white overflow-hidden group flex flex-col">
                            <div className="relative aspect-square overflow-hidden bg-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                        {product.category?.name || product.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight line-clamp-1">{product.name}</h3>
                                    <span className="text-sm font-black text-slate-900">${product.price.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
                                    <button
                                        onClick={() => navigate(`/seller/product/${product._id}/edit`)}
                                        className="flex-1 flex items-center justify-center bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-[11px]"
                                    >
                                        <Edit className="h-3.5 w-3.5 mr-2" /> Edit Details
                                    </button>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        className="p-3 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerScreen;
