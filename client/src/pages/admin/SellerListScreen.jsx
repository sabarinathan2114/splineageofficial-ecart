import React, { useState } from 'react';
import { useGetUsersQuery, useDeleteUserMutation, useGetSellerStatsQuery } from '../../redux/api/userApiSlice';
import { Trash2, Store, Mail, Phone, Calendar, User as UserIcon, X, BarChart3, Package, DollarSign, Activity } from 'lucide-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const SellerStatsModal = ({ sellerId, onClose }) => {
    const { data, isLoading, error } = useGetSellerStatsQuery(sellerId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-6 sm:p-8">
                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader /></div>
                    ) : error ? (
                        <Message variant="danger">{error?.data?.message || 'Failed to load stats'}</Message>
                    ) : data ? (
                        <>
                            <div className="flex items-center mb-6">
                                <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                                    <Store className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{data.seller.name}</h2>
                                    <span className="text-sm text-slate-500 font-medium">{data.seller.email}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center text-blue-600 mb-2">
                                        <Package className="h-5 w-5 mr-2" />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Products</span>
                                    </div>
                                    <div className="text-3xl font-black text-slate-900">{data.stats.totalProducts}</div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center text-emerald-600 mb-2">
                                        <Activity className="h-5 w-5 mr-2" />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Sold</span>
                                    </div>
                                    <div className="text-3xl font-black text-slate-900">{data.stats.totalSold}</div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center text-indigo-600 mb-2">
                                        <DollarSign className="h-5 w-5 mr-2" />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Balance</span>
                                    </div>
                                    <div className="text-3xl font-black text-slate-900">${data.stats.balance.toFixed(2)}</div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex items-center text-rose-600 mb-2">
                                        <BarChart3 className="h-5 w-5 mr-2" />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Out of Stock</span>
                                    </div>
                                    <div className="text-3xl font-black text-slate-900">{data.stats.outOfStock}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</span>
                                    <span className="text-sm font-black text-slate-900">{data.seller.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</span>
                                    <span className="text-sm font-black text-slate-900">{new Date(data.seller.joined).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const SellerListScreen = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
    const [selectedSellerId, setSelectedSellerId] = useState(null);

    const sellers = users?.filter(user => user.role === 'seller') || [];

    const deleteHandler = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to remove this seller?')) {
            try {
                await deleteUser(id).unwrap();
                refetch();
                toast.success('Seller removed successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error || 'Failed to delete seller');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Admin Only</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">Seller Management</h1>
                <p className="text-slate-500 font-medium italic">Overview of all registered vendors on the platform.</p>
            </div>

            {loadingDelete && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : sellers.length === 0 ? (
                <div className="premium-card bg-white p-20 text-center">
                    <Store className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No Sellers Found</h3>
                    <p className="text-slate-500 font-medium">There are currently no users registered as sellers.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sellers.map((seller) => (
                        <div
                            key={seller._id}
                            onClick={() => setSelectedSellerId(seller._id)}
                            className="bg-white rounded-2xl overflow-hidden group border border-slate-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-lg cursor-pointer flex flex-col"
                        >
                            <div className="p-4 flex-grow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                        <Store className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <button
                                        onClick={(e) => deleteHandler(seller._id, e)}
                                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Remove Seller"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <h3 className="text-base font-black text-slate-900 mb-0.5 truncate">{seller.name}</h3>
                                <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase mb-3">
                                    ID: {seller._id.substring(seller._id.length - 8)}
                                </div>
                                <div className="text-xs font-bold text-blue-600 flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    View Stats <Activity className="h-3 w-3 ml-1" />
                                </div>
                            </div>

                            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t border-slate-100">
                                <span className="bg-emerald-100 text-emerald-600 font-black px-2 py-1 rounded text-[9px] uppercase tracking-widest leading-none">Active</span>
                                <span className="text-[10px] font-bold text-slate-400">{new Date(seller.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedSellerId && (
                <SellerStatsModal
                    sellerId={selectedSellerId}
                    onClose={() => setSelectedSellerId(null)}
                />
            )}
        </div>
    );
};

export default SellerListScreen;
