import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetUserDetailsQuery, useUpdateUserMutation, useRegisterMutation } from '../../redux/api/userApiSlice';
import { ArrowLeft, User, Mail, Shield, Save, Loader2, Store, UserCheck, Activity, Lock, Plus, ChevronDown, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const UserEditScreen = () => {
    const { id: userId } = useParams();
    const isAddMode = !userId || userId === 'add';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const [status, setStatus] = useState('Active');
    const [accessLevel, setAccessLevel] = useState('Full Access');

    const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId, { skip: isAddMode });
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
    const [register, { isLoading: loadingRegister }] = useRegisterMutation();

    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();

    // --- CUSTOM DROPDOWN COMPONENT ---
    const CustomDropdown = ({ label, value, options, onSelect, id }) => {
        const isOpen = openDropdown === id;

        // Close on click outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (isOpen && !event.target.closest(`#dropdown-${id}`)) {
                    setOpenDropdown(null);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [isOpen, id]);

        const selectedOption = options.find(opt => opt.value === value) || options[0];

        return (
            <div className="space-y-3 group/field relative" id={`dropdown-${id}`}>
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 group-focus-within/field:text-slate-900 transition-colors">{label}</label>
                <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : id)}
                    className={`w-full bg-slate-50 border-2 rounded-[22px] py-3.5 px-6 text-[15px] font-bold text-slate-900 transition-all outline-none flex items-center justify-between hover:border-slate-300 ${isOpen ? 'border-slate-900 ring-4 ring-slate-900/5 bg-white' : 'border-slate-100'}`}
                >
                    <span className="truncate">{selectedOption.label}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-900' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-[100] top-full left-0 w-full mt-3 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-[24px] shadow-2xl shadow-slate-900/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                        <div className="p-2">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onSelect(option.value);
                                        setOpenDropdown(null);
                                    }}
                                    className={`w-full text-left px-5 py-3.5 rounded-[18px] text-[13px] font-bold transition-all flex items-center justify-between group/item ${value === option.value ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    {option.label}
                                    {value === option.value && <CheckCircle className="h-4 w-4 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (user && !isAddMode) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role || 'buyer');
            setStatus(user.status || 'Active');
            setAccessLevel(user.accessLevel || (user.role === 'admin' ? 'All Access' : 'Limited Access'));
        }
    }, [user, isAddMode]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (isAddMode && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            if (isAddMode) {
                await register({ name, email, password, role, status, accessLevel }).unwrap();
                toast.success('User created successfully');
            } else {
                await updateUser({ userId, name, email, role, status, accessLevel }).unwrap();
                toast.success('User updated successfully');
                refetch();
            }
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    if (isLoading && !isAddMode) return <div className="py-20"><Loader /></div>;

    return (
        <div className="min-h-screen p-2 sm:p-3">
            <div className="max-w-4xl mx-auto">

                <div className="mb-8 px-4 sm:px-0">
                    <Link to="/admin/userlist" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all mb-6 group bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10">Admin Access</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase mb-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
                        {isAddMode ? 'Add' : 'Edit'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">User</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-1">
                        {isAddMode ? 'Create a new user profile' : `Managing user details for ID: ${userId?.substring(0, 8)}`}
                    </p>
                </div>

                {!isAddMode && error ? (
                    <div className="px-4 sm:px-0">
                        <Message variant="danger">{error?.data?.message || error.error}</Message>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="premium-card bg-white p-6 sm:p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] rounded-[40px] sm:rounded-[50px] relative overflow-hidden group">
                            <div className="space-y-10 sm:space-y-12 relative">
                                {/* Section: General Information */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-[2px] bg-slate-900 rounded-full"></div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">User Information</label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3 group/field">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 group-focus-within/field:text-slate-900 transition-colors">Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within/field:text-slate-900 transition-colors" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Enter full name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] py-4 pl-14 pr-8 text-[15px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 group/field">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 group-focus-within/field:text-slate-900 transition-colors">Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within/field:text-slate-900 transition-colors" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="example@domain.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] py-4 pl-14 pr-8 text-[15px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {isAddMode && (
                                            <>
                                                <div className="space-y-3 group/field">
                                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 group-focus-within/field:text-slate-900 transition-colors">Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within/field:text-slate-900 transition-colors" />
                                                        <input
                                                            required
                                                            type="password"
                                                            placeholder="••••••••"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] py-4 pl-14 pr-8 text-[15px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3 group/field">
                                                    <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 group-focus-within/field:text-slate-900 transition-colors">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within/field:text-slate-900 transition-colors" />
                                                        <input
                                                            required
                                                            type="password"
                                                            placeholder="••••••••"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[28px] py-4 pl-14 pr-8 text-[15px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Section: Attributes & Permissions */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-[2px] bg-slate-900 rounded-full"></div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Account Details</label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <CustomDropdown
                                            id="role"
                                            label="Role"
                                            value={role}
                                            onSelect={setRole}
                                            options={[
                                                { label: 'Buyer / Customer', value: 'buyer' },
                                                { label: 'B2B Seller', value: 'seller' },
                                                { label: 'Administrator', value: 'admin' }
                                            ]}
                                        />
                                        <CustomDropdown
                                            id="status"
                                            label="Status"
                                            value={status}
                                            onSelect={setStatus}
                                            options={[
                                                { label: 'Active', value: 'Active' },
                                                { label: 'Inactive', value: 'Inactive' },
                                                { label: 'Deactivated', value: 'Deactivated' }
                                            ]}
                                        />
                                        <CustomDropdown
                                            id="accessLevel"
                                            label="Access Level"
                                            value={accessLevel}
                                            onSelect={setAccessLevel}
                                            options={[
                                                { label: 'Full Access (Owner)', value: 'Full Access' },
                                                { label: 'Standard Access (Operator)', value: 'Standard Access' },
                                                { label: 'Restricted Access (Limited)', value: 'Restricted Access' },
                                                { label: 'View Only (Auditor)', value: 'View Only' }
                                            ]}
                                        />
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                            <Activity className="h-5 w-5 text-slate-900 animate-pulse" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Configuration ready</p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-0.5">Secure Session Active</p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loadingUpdate || loadingRegister}
                                        className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loadingUpdate || loadingRegister ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : isAddMode ? (
                                            <Plus className="h-4 w-4" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        {isAddMode ? 'Add User' : 'Update User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserEditScreen;
