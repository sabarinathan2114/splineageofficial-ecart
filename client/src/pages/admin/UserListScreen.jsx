import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../redux/api/userApiSlice';
import { Trash2, Edit, Check, X, Store, User as UserIcon, Search, Plus, Shield, UserCheck, Users, Activity, Loader2, EyeOff } from 'lucide-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const UserListScreen = () => {
    const [activeTab, setActiveTab] = useState('Admin Users');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const tabs = ['Admin Users', 'Seller Users', 'Customer Users', 'Activity Logs'];

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || 'Failed to delete user');
            }
        }
    };

    const statusHandler = async (id, status) => {
        try {
            await updateUser({ userId: id, status }).unwrap();
            toast.success(`User ${status.toLowerCase()} successfully`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update status');
        }
    };

    const filteredUsers = users?.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'Admin Users') return matchesSearch && user.role === 'admin';
        if (activeTab === 'Seller Users') return matchesSearch && user.role === 'seller';
        if (activeTab === 'Customer Users') return matchesSearch && user.role === 'buyer';
        return matchesSearch; // For Activity Logs, show all
    }) || [];

    if (isLoading) return <Loader />;
    if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

    const getAddButtonLabel = () => {
        if (activeTab === 'Admin Users') return 'Add Admin User';
        if (activeTab === 'Seller Users') return 'Add Seller User';
        if (activeTab === 'Customer Users') return 'Add Customer User';
        return 'Add New User';
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">User Management</h1>
                <p className="text-slate-500 font-medium italic">Manage admins, sellers, and customer accounts.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setSearchTerm('');
                        }}
                        className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="relative w-full sm:max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab.toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    />
                </div>
                <button
                    onClick={() => navigate('/admin/user/add')}
                    className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-[12px] md:text-sm"
                >
                    <Plus className="h-5 w-5" />
                    {getAddButtonLabel()}
                </button>
            </div>

            {/* User Table - Fixed Responsiveness */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-[#F8F9FB] border-b border-slate-100">
                            <tr>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Level</th>
                                {activeTab === 'Activity Logs' && (
                                    <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                )}
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Join Date</th>
                                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 border-collapse">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={activeTab === 'Activity Logs' ? 7 : 6} className="py-12 text-center text-slate-400 font-medium italic">
                                        No users found in this category.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-5 px-6 whitespace-nowrap">
                                            <span className="font-bold text-slate-900">{user.name}</span>
                                        </td>
                                        <td className="py-5 px-6 whitespace-nowrap">
                                            <span className="text-slate-500 font-medium">{user.email}</span>
                                        </td>
                                        <td className="py-5 px-6 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                                                user.status === 'Inactive' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                                }`}>
                                                {user.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-[#F3E8FF] text-[#A855F7] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                    <Shield className="h-3 w-3" />
                                                    {user.accessLevel || (user.role === 'admin' ? 'All Access' : 'Limited Access')}
                                                </span>
                                            </div>
                                        </td>
                                        {activeTab === 'Activity Logs' && (
                                            <td className="py-5 px-6 whitespace-nowrap">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${user.role === 'admin' ? 'text-blue-600 bg-blue-50' :
                                                    user.role === 'seller' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                        )}
                                        <td className="py-5 px-6 whitespace-nowrap">
                                            <span className="text-slate-400 font-mono text-xs">{new Date(user.createdAt).toISOString().split('T')[0]}</span>
                                        </td>
                                        <td className="py-5 px-6 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    to={`/admin/user/${user._id}/edit`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90"
                                                    title="Edit Account"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>

                                                <button
                                                    onClick={() => statusHandler(user._id, user.status === 'Active' ? 'Inactive' : 'Active')}
                                                    className={`p-2 transition-all active:scale-90 rounded-lg ${user.status === 'Active'
                                                        ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                                                        : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                    title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                                                >
                                                    {user.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                                </button>

                                                <button
                                                    onClick={() => deleteHandler(user._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListScreen;
