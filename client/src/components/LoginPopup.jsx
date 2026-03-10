import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, User, ArrowRight, Zap } from 'lucide-react';

const LoginPopup = () => {
    const [show, setShow] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            const timer = setTimeout(() => {
                setShow(true);
            }, 10000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [userInfo]);

    if (!show || userInfo) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                {/* Close Button */}
                <button
                    onClick={() => setShow(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="p-8 sm:p-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <User className="h-8 w-8 text-blue-600" />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                        Unlock Premium Experience.
                    </h2>
                    <p className="text-slate-500 font-medium mb-8">
                        Join our community to track orders, save multiple addresses, and get personalized recommendations.
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/login"
                            onClick={() => setShow(false)}
                            className="flex items-center justify-between w-full bg-slate-900 text-white p-5 rounded-2xl font-bold hover:bg-slate-800 transition-all group shadow-xl shadow-slate-200"
                        >
                            <span>Sign In to Account</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/register"
                            onClick={() => setShow(false)}
                            className="flex items-center justify-center w-full bg-blue-50 text-blue-600 p-5 rounded-2xl font-bold hover:bg-blue-100 transition-all"
                        >
                            <span>Create New Account</span>
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                        <Zap className="h-4 w-4 fill-current text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">Join 10k+ Happy Shoppers</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;
