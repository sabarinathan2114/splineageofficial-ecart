import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Wallet, ArrowRight, ShoppingBag } from 'lucide-react';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress]);

    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
            <CheckoutSteps step1 step2 step3 />

            <div className="premium-card p-4 sm:p-6 md:p-10 bg-white">
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 mb-1 sm:mb-2 flex items-center tracking-tight">
                    <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
                    Payment Method
                </h1>
                <p className="text-slate-500 mb-6 sm:mb-10 font-medium text-xs sm:text-sm md:text-base">Choose your preferred way to pay</p>

                <form onSubmit={submitHandler} className="space-y-6 sm:space-y-8">
                    <div className="space-y-4 sm:space-y-6">
                        <label className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black text-slate-400 ml-1">Select Method</label>

                        <div className="grid gap-3 sm:gap-4">
                            <div
                                onClick={() => setPaymentMethod('Razorpay')}
                                className={`flex items-center p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'Razorpay'
                                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10'
                                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                                    }`}
                            >
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-colors ${paymentMethod === 'Razorpay' ? 'border-blue-500' : 'border-slate-300'
                                    }`}>
                                    {paymentMethod === 'Razorpay' && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-in zoom-in-50 duration-300" />}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-slate-900 text-base sm:text-lg">Razorpay</span>
                                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">UPI, Cards, NetBanking</span>
                                </div>
                                <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-colors ${paymentMethod === 'Razorpay' ? 'bg-blue-100/50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                            </div>

                            <div
                                onClick={() => setPaymentMethod('COD')}
                                className={`flex items-center p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'COD'
                                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10'
                                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                                    }`}
                            >
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-colors ${paymentMethod === 'COD' ? 'border-blue-500' : 'border-slate-300'
                                    }`}>
                                    {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-in zoom-in-50 duration-300" />}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold text-slate-900 text-base sm:text-lg">Cash on Delivery</span>
                                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Pay when you receive</span>
                                </div>
                                <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-colors ${paymentMethod === 'COD' ? 'bg-blue-100/50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] group"
                    >
                        Continue to Order
                        <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentScreen;
