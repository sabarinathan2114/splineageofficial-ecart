import React, { useState } from 'react';
import { useGetAllOrdersQuery } from '../../redux/api/adminApiSlice';
import { ShoppingBag, Check, X, Eye, Calendar, User as UserIcon, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const OrderListScreen = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const { data: orders, isLoading, error } = useGetAllOrdersQuery();

    const filteredOrders = orders?.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 mb-2">Order Management</h1>
                <p className="text-slate-500 font-medium italic">Track and manage all customer orders.</p>
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error || 'Order data unavailable. Please refresh or re-login.'}
                </Message>
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <div className="relative w-full sm:max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by order ID or customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="premium-card bg-white overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white">
                                <tr>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest">ID</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest">Customer</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-center hidden sm:table-cell">Date</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-center">Method</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-center">Total</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-center">Paid</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-center hidden md:table-cell">Delivered</th>
                                    <th className="py-4 px-3 sm:px-6 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-12 text-center text-slate-400 font-medium italic">
                                            No orders found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-3 sm:px-6 text-[10px] font-mono text-slate-400">{order._id.substring(order._id.length - 4).toUpperCase()}</td>
                                            <td className="py-4 px-3 sm:px-6">
                                                <div className="flex items-center">
                                                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 sm:mr-3 shrink-0">
                                                        <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-[11px] sm:text-sm line-clamp-1">{order.user?.name || 'User'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-3 text-center text-[10px] text-slate-500 font-medium hidden md:table-cell">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-3 text-center">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter">
                                                    {order.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="py-4 px-3 text-center font-black text-slate-900 text-[11px] sm:text-sm">
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className="py-4 px-3 text-center">
                                                {order.isPaid ? (
                                                    <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                                                ) : (
                                                    <X className="h-4 w-4 text-rose-600 mx-auto" />
                                                )}
                                            </td>
                                            <td className="py-4 px-3 text-center hidden md:table-cell">
                                                {order.isDelivered ? (
                                                    <Check className="h-4 w-4 text-blue-600 mx-auto" />
                                                ) : (
                                                    <X className="h-4 w-4 text-rose-600 mx-auto" />
                                                )}
                                            </td>
                                            <td className="py-4 px-3 text-right">
                                                <button
                                                    onClick={() => navigate(`/order/${order._id}`)}
                                                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2 px-4 rounded-xl transition-all"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default OrderListScreen;