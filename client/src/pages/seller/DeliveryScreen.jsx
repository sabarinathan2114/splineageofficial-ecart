import React, { useState } from 'react';
import { Truck, Search, Eye, Filter, Loader2, ChevronDown } from 'lucide-react';
import { useGetSellerOrdersQuery } from '../../redux/api/ordersApiSlice';

const DeliveryScreen = () => {
    const { data: orders, isLoading, error } = useGetSellerOrdersQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isStatusOpen, setIsStatusOpen] = useState(false);

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
                <p className="text-red-500 font-bold mb-4">Error loading delivery data: {error?.data?.message || error?.error || "Unknown Error"}</p>
            </div>
        );
    }

    // Filter valid orders that are paid
    let displayOrders = orders ? orders.filter(o => o.isPaid) : [];

    if (statusFilter !== 'all') {
        displayOrders = displayOrders.filter(o => {
            if (statusFilter === 'delivered') return o.isDelivered;
            if (statusFilter === 'pending') return !o.isDelivered;
            return true;
        });
    }

    if (searchTerm) {
        displayOrders = displayOrders.filter(o =>
            `order_${o._id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Truck className="w-10 h-10 text-blue-600" />
                        Delivery Tracking
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Monitor your outstation product deliveries</p>
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
                <div className="flex items-center gap-2 w-full sm:w-auto relative">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <button
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        className="flex items-center justify-between gap-3 bg-slate-50 border-none rounded-xl px-5 py-2.5 text-sm font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-100 w-full sm:w-48 h-11 transition-all hover:bg-slate-100"
                    >
                        <span className="truncate">
                            {statusFilter === 'all' ? 'All Status' : statusFilter === 'pending' ? 'In Transit' : 'Delivered'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isStatusOpen && (
                        <>
                            <div className="fixed inset-0 z-20" onClick={() => setIsStatusOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-full sm:w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-30 animate-in fade-in zoom-in-95 duration-200">
                                {[
                                    { id: 'all', label: 'All Status' },
                                    { id: 'pending', label: 'In Transit' },
                                    { id: 'delivered', label: 'Delivered' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setStatusFilter(option.id);
                                            setIsStatusOpen(false);
                                        }}
                                        className={`w-full text-left px-5 py-3 text-xs font-bold transition-colors ${statusFilter === option.id
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-320px)] min-h-[400px]">
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Order ID</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Product Status</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Delivery Status</th>
                                <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {displayOrders.length > 0 ? displayOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-blue-600">order_{order._id.substring(0, 8)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{order.user?.name || 'Guest'}</span>
                                            <span className="text-xs text-slate-500">{order.shippingAddress?.city}, {order.shippingAddress?.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center flex-wrap gap-2 max-w-[200px] mx-auto">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg w-full">
                                                    <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover" />
                                                    <span className="text-xs font-bold text-slate-700 truncate">{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {order.isDelivered ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                Delivered
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                                In Transit
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all mr-2">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                                        <div className="flex flex-col items-center gap-3">
                                            <Truck className="w-8 h-8 text-slate-300" />
                                            No delivery records found matching your criteria.
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

export default DeliveryScreen;
