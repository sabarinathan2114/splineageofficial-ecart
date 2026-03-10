import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    TrendingUp, Package, AlertTriangle, ShoppingBag,
    DollarSign, BarChart2, Clock, ArrowRight, Star,
    RefreshCcw, Loader2
} from 'lucide-react';
import { useGetSellerDashboardStatsQuery } from '../../redux/api/ordersApiSlice';
import { useDeleteProductMutation } from '../../redux/api/productApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const StatCard = ({ label, value, sub, icon: Icon, color = 'blue', bg = 'bg-white' }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        amber: 'text-amber-600 bg-amber-50',
        rose: 'text-rose-600 bg-rose-50',
        purple: 'text-purple-600 bg-purple-50',
    };
    return (
        <div className={`${bg} rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
                <span className={`p-2 rounded-xl ${colors[color]}`}><Icon className="h-4 w-4" /></span>
            </div>
            <div>
                <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
                {sub && <p className="text-xs text-slate-400 font-medium mt-1">{sub}</p>}
            </div>
        </div>
    );
};

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [selectedProductId, setSelectedProductId] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);
    const { data: stats, isLoading, error, refetch } = useGetSellerDashboardStatsQuery();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const handleRefresh = async () => {
        try {
            await refetch();
            toast.success('Dashboard data updated');
        } catch (err) {
            toast.error('Failed to refresh dashboard');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to remove this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product removed');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    if (isLoading || loadingDelete) return <Loader />;
    if (error) return <Message variant="danger">{error?.data?.message || 'Failed to load dashboard'}</Message>;

    const lowStockCount = stats.lowStock?.length || 0;

    return (
        <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Seller Hub</p>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                        Welcome, <span className="text-blue-600">{userInfo?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Here's how your store is doing.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/seller/products" className="flex items-center bg-[#0B1120] text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg shadow-blue-500/10">
                        <Package className="h-4 w-4 mr-2" /> My Products
                    </Link>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center bg-slate-100 text-slate-700 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest group"
                    >
                        <RefreshCcw className="h-3.5 w-3.5 mr-2 group-active:rotate-180 transition-transform duration-500" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 mb-6 animate-in fade-in">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                    <p className="text-sm font-black text-amber-700">
                        {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on stock!
                        <span className="font-medium text-amber-600 ml-1">Restock soon to avoid missed sales.</span>
                    </p>
                </div>
            )}

            {/* Time-period Sales Stats */}
            <div className="mb-8">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Sales Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <StatCard label="Today — Units" value={stats.today.units} sub={`₹${stats.today.revenue} revenue`} icon={TrendingUp} color="blue" />
                    <StatCard label="This Week" value={stats.week.units} sub={`₹${stats.week.revenue} revenue`} icon={BarChart2} color="purple" />
                    <StatCard label="This Month" value={stats.month.units} sub={`₹${stats.month.revenue} revenue`} icon={DollarSign} color="emerald" />
                    <StatCard label="All-Time Units" value={stats.allTime.units} sub="total sold" icon={ShoppingBag} color="amber" />
                    <StatCard label="All-Time Revenue" value={`₹${stats.allTime.revenue}`} sub={`${stats.totalProducts} products`} icon={Star} color="rose" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Low Stock Products */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-700">Low Stock</h2>
                        {lowStockCount > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">{lowStockCount} items</span>
                        )}
                    </div>
                    {stats.lowStock.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <Package className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                            <p className="text-xs font-bold">All products are well stocked!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.lowStock.map((p) => (
                                <div key={p._id} className="group relative">
                                    <div
                                        onClick={() => setSelectedProductId(selectedProductId === p._id ? null : p._id)}
                                        className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border-2 ${selectedProductId === p._id ? 'border-blue-100 bg-blue-50/30' : 'border-transparent'}`}
                                    >
                                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover bg-slate-100 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-slate-900 truncate">{p.name}</p>
                                            <p className="text-[10px] text-slate-400">₹{p.price}</p>
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg shrink-0 ${p.countInStock === 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'}`}>
                                            {p.countInStock === 0 ? 'Out!' : `${p.countInStock} left`}
                                        </span>
                                    </div>

                                    {/* Action Buttons - Appear only when selected */}
                                    {selectedProductId === p._id && (
                                        <div className="flex gap-2 mt-2 ml-13 px-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/seller/product/${p._id}/edit`);
                                                }}
                                                className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all active:scale-95 flex items-center shadow-sm"
                                            >
                                                Update Stocks
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteHandler(p._id);
                                                }}
                                                className="text-[10px] font-black text-rose-600 hover:text-rose-700 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 transition-all active:scale-95 flex items-center shadow-sm"
                                            >
                                                Remove Product
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Selling Products */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-4">Top Selling Products</h2>
                    {stats.topProducts.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                            <p className="text-xs font-bold">No sales data yet. Share your products!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.topProducts.map((p, i) => (
                                <div key={p._id} className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-400 w-5 text-right shrink-0">#{i + 1}</span>
                                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-xl object-cover bg-slate-100 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-slate-900 truncate">{p.name}</p>
                                        <p className="text-[10px] text-slate-400">{p.totalSold} units sold</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-600 shrink-0">₹{p.revenue}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-700">Recent Orders</h2>
                    <Link to="/seller/orders" className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                        View All <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                </div>
                {stats.recentOrders.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <Clock className="h-10 w-10 mx-auto mb-3 text-slate-200" />
                        <p className="text-xs font-bold">No paid orders yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</th>
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue</th>
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats.recentOrders.map((o) => (
                                    <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 font-mono text-[10px] text-blue-600 font-bold">#{String(o._id).slice(-8).toUpperCase()}</td>
                                        <td className="py-3 text-xs font-black text-slate-800">{o.customerName}</td>
                                        <td className="py-3 text-xs text-slate-500 font-medium">{o.items} item{o.items !== 1 ? 's' : ''}</td>
                                        <td className="py-3 text-xs font-black text-emerald-600 text-right">₹{o.revenue}</td>
                                        <td className="py-3 text-[10px] text-slate-400 font-medium text-right">{new Date(o.paidAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
