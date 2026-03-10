import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../redux/api/userApiSlice';
import { ArrowLeft, User, Mail, Shield, Save, Loader2, AlertCircle, Store } from 'lucide-react';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const UserEditScreen = () => {
    const { id: userId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);

    const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.role === 'admin');
            setIsSeller(user.role === 'seller');
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const role = isAdmin ? 'admin' : isSeller ? 'seller' : 'buyer';
            await updateUser({ userId, name, email, role }).unwrap();
            toast.success('User updated successfully');
            refetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
            <Link to="/admin/userlist" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8 group">
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Users
            </Link>

            <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Admin Only</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Edit User</h1>
                <p className="text-slate-500 font-medium italic">Modify permissions and contact details for this account.</p>
            </div>

            {loadingUpdate && <Loader />}
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}
                </Message>
            ) : (
                <form onSubmit={submitHandler} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="premium-card bg-white p-8 border border-slate-100 shadow-sm rounded-3xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <User className="h-24 w-24 text-slate-900" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label
                                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${isAdmin ? 'bg-blue-50 border-blue-600 shadow-lg shadow-blue-500/10' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                                    onClick={() => { setIsAdmin(!isAdmin); if (isSeller) setIsSeller(false); }}
                                >
                                    <div className="flex items-center">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-4 ${isAdmin ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-900">Administrator</p>
                                            <p className="text-[10px] font-bold text-slate-400">Full platform access</p>
                                        </div>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${isAdmin ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                        {isAdmin && <Save className="h-3 w-3 text-white" />}
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${isSeller ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                                    onClick={() => { setIsSeller(!isSeller); if (isAdmin) setIsAdmin(false); }}
                                >
                                    <div className="flex items-center">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-4 ${isSeller ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            <Store className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-900">Seller Agent</p>
                                            <p className="text-[10px] font-bold text-slate-400">Merchant capabilities</p>
                                        </div>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${isSeller ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                                        {isSeller && <Save className="h-3 w-3 text-white" />}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loadingUpdate}
                        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                    >
                        {loadingUpdate ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Commit Changes
                    </button>
                </form>
            )}
        </div>
    );
};

export default UserEditScreen;
