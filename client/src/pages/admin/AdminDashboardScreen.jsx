import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAdminStatsQuery } from '../../redux/api/adminApiSlice';
import {
    Users,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    Package,
    AlertTriangle,
    CheckCircle2,
    Clock,
    UserCheck
} from 'lucide-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AdminDashboardScreen = () => {
    const { data: stats, isLoading, error } = useGetAdminStatsQuery();

    if (isLoading) return <Loader />;

    if (error) {
        console.error('Dashboard Stats Error:', error);
        return (
            <div className="max-w-7xl mx-auto py-8 px-4">
                <Message variant="danger">
                    {error?.data?.message || error.error || 'Could not load dashboard data. Please try logging out and back in.'}
                </Message>
            </div>
        );
    }

    const statCards = [
        { title: 'Total Revenue', value: `$${stats.financials.totalSales.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/orderlist' },
        { title: 'Total Orders', value: stats.counts.orders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/orderlist' },
        { title: 'Active Products', value: stats.counts.products, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/productlist' },
        { title: 'Total Vendors', value: stats.counts.sellers, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/sellerlist' },
    ];

    const timeFrames = [
        { label: 'Weekly Revenue', value: `$${stats.financials.weekSales.toFixed(2)}`, icon: Clock },
        { label: 'Monthly Revenue', value: `$${stats.financials.monthSales.toFixed(2)}`, icon: Calendar },
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Dashboard</h1>
                <p className="text-slate-500 font-medium italic">Comprehensive overview of your business performance.</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat, index) => (
                    <Link key={index} to={stat.link} className="premium-card p-6 bg-white flex items-center shadow-sm hover:ring-2 hover:ring-blue-100 transition-all group">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mr-5 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Financial Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="premium-card p-6 bg-white">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-3 text-blue-600" />
                            Financial Breakdown
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                <span className="text-slate-600 font-bold">Today</span>
                                <span className="text-emerald-600 font-black">${stats.financials.todaySales.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                <span className="text-slate-600 font-bold">This Week</span>
                                <span className="text-blue-600 font-black">${stats.financials.weekSales.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                <span className="text-slate-600 font-bold">This Month</span>
                                <span className="text-indigo-600 font-black">${stats.financials.monthSales.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-white">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <UserCheck className="h-5 w-5 mr-3 text-blue-600" />
                            User Statistics
                        </h2>
                        <Link to="/admin/sellerlist" className="flex items-center justify-between mb-4 hover:bg-slate-50 p-2 rounded-xl transition-colors">
                            <span className="text-slate-600 font-medium">Total Vendors</span>
                            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                                {stats.counts.sellers} Sellers
                            </span>
                        </Link>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Total Customers</span>
                            <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                                {stats.counts.users} Users
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Sections */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Low Stock Alerts */}
                    <div className="premium-card p-6 bg-white overflow-hidden">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-3 text-amber-500" />
                            Inventory Alerts
                        </h2>
                        {stats.lowStock.length === 0 ? (
                            <div className="flex items-center text-emerald-600 font-bold bg-emerald-50 p-4 rounded-2xl">
                                <CheckCircle2 className="h-5 w-5 mr-3" />
                                All products are well stocked!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 italic font-bold text-slate-400">
                                            <th className="pb-4 px-2">Product</th>
                                            <th className="pb-4 px-2">Category</th>
                                            <th className="pb-4 px-2">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {stats.lowStock.map((product) => (
                                            <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center font-bold text-slate-900">
                                                        <img src={product.image} className="w-8 h-8 rounded-lg mr-3 object-cover" />
                                                        {product.name}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-slate-500 font-medium">{product.category}</td>
                                                <td className="py-4 px-2">
                                                    <span className="bg-rose-100 text-rose-600 font-black px-3 py-1 rounded-full text-xs">
                                                        {product.countInStock} left
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardScreen;

const Calendar = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
);
