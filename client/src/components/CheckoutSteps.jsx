import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';

const CheckoutSteps = ({ step2, step3, step4 }) => {
    const steps = [
        { name: 'Shipping', path: '/shipping', active: true, completed: step2 || step3 || step4 },
        { name: 'Payment', path: '/payment', active: step2 || step3, completed: step3 || step4 },
        { name: 'Review', path: '/placeorder', active: step4, completed: false },
    ];

    return (
        <nav className="flex items-center justify-center mb-16 py-4">
            <div className="flex items-center w-full max-w-xl relative">
                {/* Background Line */}
                <div className="absolute top-4 sm:top-5 left-[15%] right-[15%] h-0.5 sm:h-1 bg-slate-100 rounded-full"></div>

                {/* Active Progress Line */}
                <div
                    className="absolute top-4 sm:top-5 left-[15%] h-0.5 sm:h-1 bg-blue-600 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    style={{
                        width: step4 ? '70%' : step3 ? '35%' : '0%'
                    }}
                ></div>

                {steps.map((step, index) => (
                    <div key={step.name} className="flex-1 flex flex-col items-center relative z-10">
                        {/* Circle Indicator */}
                        <div className="relative group">
                            {step.completed ? (
                                <Link
                                    to={step.path}
                                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-100 transition-all hover:scale-110 active:scale-95"
                                >
                                    <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3.5px]" />
                                </Link>
                            ) : step.active ? (
                                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-blue-600 text-blue-600 shadow-xl shadow-blue-50/50 ring-4 sm:ring-8 ring-blue-50 transition-all">
                                    <span className="font-black text-xs sm:text-sm">{index + 1}</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-300">
                                    <span className="font-bold text-xs sm:text-sm">{index + 1}</span>
                                </div>
                            )}
                        </div>

                        {/* Step Name */}
                        <span className={`mt-2 sm:mt-4 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center transition-colors duration-300 ${step.active || step.completed ? 'text-slate-900' : 'text-slate-400'
                            }`}>
                            {step.name}
                        </span>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default CheckoutSteps;
