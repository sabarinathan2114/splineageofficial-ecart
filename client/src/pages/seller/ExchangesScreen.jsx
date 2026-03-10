import React, { useState } from 'react';
import { RefreshCw, Search, Eye, Loader2 } from 'lucide-react';
import { useGetSellerOrdersQuery } from '../../redux/api/ordersApiSlice';

const ExchangesScreen = () => {
    // We'll mimic the refunds UI but since there's no exchange status in backend yet,
    // we'll filter for a hypothetical 'exchange' status or show empty.
    const { data: orders, isLoading, error } = useGetSellerOrdersQuery();
    const [searchTerm, setSearchTerm] = useState('');

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
                <p className="text-red-500 font-bold mb-4">Error loading exchange data.</p>
            </div>
        );
    }

    // Since 'exchange' isn't explicitly defined in backend Enum ('paid', 'pending', 'fail', 'refund'), we'll show an empty list for now until expanded.
    let exchangeOrders = orders ? orders.filter(o => o.orderStatus === 'exchange') : [];

    if (searchTerm) {
        exchangeOrders = exchangeOrders.filter(o =>
            `order_${o._id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <RefreshCw className="w-10 h-10 text-blue-600" />
                        Exchange Management
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and track customer exchanges</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-shadow"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-320px)] min-h-[400px]">
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Date Requested</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Reason</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Status</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {exchangeOrders.length > 0 ? exchangeOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-blue-600">order_{order._id.substring(0, 8)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">{new Date(order.updatedAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{order.user?.name || 'Guest'}</span>
                                            <span className="text-xs text-slate-500">{order.user?.email || order.user?.phoneNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="text-sm font-medium text-slate-700">Size Issue</span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-black uppercase tracking-wider">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                            Pending Exchange
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCw className="w-8 h-8 text-slate-300" />
                                            No exchange records found matching your criteria.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExchangesScreen;
