import React, { useState } from 'react';
import { useGetSellerOrdersQuery } from '../../redux/api/ordersApiSlice';
import { ShoppingBag, Search, Filter, X, ChevronDown } from 'lucide-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const SellerOrdersScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { data: sellerOrders, isLoading: loadingOrders, error: errorOrders } = useGetSellerOrdersQuery();

    const selectedStatusLabel = statusFilter === 'all'
        ? 'All Payment Status'
        : statusFilter === 'paid' ? 'Paid' : 'Unpaid';

    const filteredOrders = sellerOrders?.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'paid' && order.isPaid) ||
            (statusFilter === 'unpaid' && !order.isPaid);

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                    Customer Orders
                </h1>
                <p className="text-slate-500 font-medium">Manage and fulfill orders from your customers.</p>
            </div>

            {loadingOrders ? (
                <Loader />
            ) : errorOrders ? (
                <Message variant="danger">{errorOrders?.data?.message || errorOrders.error || 'Failed to load orders'}</Message>
            ) : (
                <>
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer Name..."
                                className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        <div className="relative min-w-[200px]">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between bg-white border border-slate-100 rounded-2xl py-3.5 px-6 text-[11px] font-black uppercase tracking-wider text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    {selectedStatusLabel}
                                </div>
                                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                        {[
                                            { id: 'all', label: 'All Payment Status' },
                                            { id: 'paid', label: 'Paid' },
                                            { id: 'unpaid', label: 'Unpaid' }
                                        ].map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setStatusFilter(option.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${statusFilter === option.id
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

                    {filteredOrders?.length === 0 ? (
                        <div className="premium-card bg-white p-20 text-center rounded-2xl border border-slate-100">
                            <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h3>
                            <p className="text-slate-500 font-medium">As soon as customers purchase your items, they'll appear here.</p>
                        </div>
                    ) : (
                        <div className="premium-card bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-900 text-white">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-[10px]">Order ID</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-[10px]">Customer</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-[10px]">Shipping Address</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-[10px]">Items</th>
                                            <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-[10px]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Order #</div>
                                                    <div className="text-[10px] font-black text-slate-900 leading-none">{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Customer ID & Name</div>
                                                    <div className="font-black text-slate-900 text-[10px] leading-tight mb-1">{order.user?.name}</div>
                                                    <div className="text-[9px] text-blue-500 font-mono font-bold leading-none">ID: {order.user?._id?.substring(order.user?._id?.length - 8).toUpperCase()}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Shipping Target</div>
                                                    <div className="text-[10px] text-slate-600 leading-relaxed font-bold uppercase tracking-tighter sm:tracking-normal">
                                                        {order.shippingAddress.address},<br />
                                                        {order.shippingAddress.city}, {order.shippingAddress.postalCode},<br />
                                                        {order.shippingAddress.country}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Purchased Products</div>
                                                    <div className="space-y-1">
                                                        {order.orderItems.map((item, i) => (
                                                            <div key={i} className="text-[10px] font-black uppercase text-blue-600 flex items-center">
                                                                <span className="bg-blue-50 px-1 rounded mr-2 min-w-[1.2rem] text-center">{item.qty}</span>
                                                                <span className="truncate max-w-[100px]">{item.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${order.isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SellerOrdersScreen;
