import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    Search,
    Filter,
    RefreshCcw,
    DollarSign,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Download,
    Calendar,
    X,
    CheckCircle2,
    Clock,
    Percent,
    Loader2,
    ChevronDown
} from 'lucide-react';
import { useGetSellerOrdersQuery, useGetSellerDashboardStatsQuery } from '../../redux/api/ordersApiSlice';

const StatsCard = ({ title, value, subtext, icon: Icon, badge, badgeColor }) => (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-red-100 transition-all duration-300">
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
            {badge && (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${badgeColor}`}>
                    {badge === 'Live' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
                    {badge}
                </span>
            )}
        </div>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">{subtext}</p>
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 transform group-hover:scale-110">
            <Icon size={120} />
        </div>
    </div>
);

const FilterModal = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState('All');
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Filter Transactions</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="relative">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Status</label>
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="w-full flex items-center justify-between bg-slate-50 border-2 border-transparent hover:border-blue-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-slate-700 transition-all outline-none"
                        >
                            {status}
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isStatusOpen && (
                            <>
                                <div className="fixed inset-0 z-20" onClick={() => setIsStatusOpen(false)} />
                                <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-30 animate-in fade-in zoom-in-95 duration-200">
                                    {['All', 'Successful', 'Pending', 'Failed', 'Refunded'].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setStatus(opt);
                                                setIsStatusOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-3 text-xs font-bold transition-colors ${status === opt
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">From</label>
                            <div className="relative">
                                <input type="date" className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-4 pr-10 text-sm font-medium outline-none" />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">To</label>
                            <div className="relative">
                                <input type="date" className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-4 pr-10 text-sm font-medium outline-none" />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10 mt-4">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

const PaymentsFinanceScreen = () => {
    const [activeTab, setActiveTab] = useState('payments');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { data: orders, isLoading: isLoadingOrders, error: errorOrders, refetch: refetchOrders } = useGetSellerOrdersQuery();
    const { data: stats, isLoading: isLoadingStats, refetch: refetchStats } = useGetSellerDashboardStatsQuery();

    if (isLoadingOrders || isLoadingStats) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-100px)]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (errorOrders) {
        return (
            <div className="text-center p-10">
                <p className="text-slate-500 font-bold mb-4">Error loading payments data.</p>
            </div>
        );
    }

    const successfulOrders = orders ? orders.filter(o => o.isPaid) : [];
    const refundedOrders = orders ? orders.filter(o => o.orderStatus === 'refund') : [];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([refetchOrders(), refetchStats()]);
            toast.success('Data refreshed successfully');
        } catch (err) {
            toast.error('Failed to refresh data');
        } finally {
            setIsRefreshing(false);
        }
    };

    const downloadCSV = (data, filename) => {
        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleExport = () => {
        if (!orders || orders.length === 0) {
            toast.warn('No data available to export');
            return;
        }

        let exportData = [];
        let filename = '';

        if (activeTab === 'payments') {
            exportData = successfulOrders.map(p => ({
                'Payment ID': p.paymentResult?.id || p._id,
                'Date': new Date(p.paidAt).toLocaleDateString(),
                'Order Ref': p._id,
                'Amount': p.totalPrice,
                'Customer': p.user?.name,
                'Email': p.user?.email,
                'Status': 'SUCCESSFUL'
            }));
            filename = 'payments_report';
        } else if (activeTab === 'refunds') {
            exportData = refundedOrders.map(r => ({
                'Refund ID': r.paymentResult?.id || r._id,
                'Date': new Date(r.updatedAt).toLocaleDateString(),
                'Order Ref': r._id,
                'Amount': r.totalPrice,
                'Customer': r.user?.name,
                'Status': 'REFUNDED'
            }));
            filename = 'refunds_report';
        } else if (activeTab === 'taxes') {
            exportData = taxes.map(t => ({
                'Transaction ID': t.id,
                'Base Amount': t.amount,
                'Gateway Fee': t.fee.toFixed(2),
                'GST (18%)': t.gst.toFixed(2),
                'Total Fee': (t.fee + t.gst).toFixed(2)
            }));
            filename = 'tax_report';
        }

        if (exportData.length > 0) {
            downloadCSV(exportData, filename);
            toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} report exported`);
        } else {
            toast.warn(`No ${activeTab} data found to export`);
        }
    };

    // Derived values from orders/stats
    const totalVolume = stats?.allTime?.revenue || 0;
    const successRate = orders?.length > 0 ? ((successfulOrders.length / orders.length) * 100).toFixed(1) : 0;
    const failedTransactions = orders ? orders.filter(o => o.orderStatus === 'fail').length : 0;

    const taxes = successfulOrders.map((o) => {
        // Mock gateway fee calculation: 2% + flat 3 rupees
        const gatewayFee = (o.totalPrice * 0.02) + 3;
        const gst = gatewayFee * 0.18;
        return {
            id: o.paymentResult?.id || `req_${o._id}`,
            amount: o.totalPrice,
            fee: gatewayFee,
            gst: gst,
        };
    });

    const totalGatewayFee = taxes.reduce((acc, t) => acc + t.fee, 0);
    const totalGst = taxes.reduce((acc, t) => acc + t.gst, 0);
    const totalRefundVolume = refundedOrders.reduce((acc, o) => acc + o.totalPrice, 0);

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

            <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-[32px] font-black text-slate-900 tracking-tight mb-2">Payments & Finance</h1>
                    <p className="text-slate-500 font-medium italic">Monitor transactions, settlements, and refunds</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[12px] font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 group"
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        {isRefreshing ? 'Updating...' : 'Refresh data'}
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[12px] font-black hover:bg-blue-100 transition-all active:scale-95"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-100 mb-8 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'payments', label: 'Payments', icon: DollarSign },
                    { id: 'refunds', label: 'Refunds', icon: RotateCcw },
                    { id: 'taxes', label: 'Taxes', icon: Percent },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute -bottom-[0px] left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_12px_rgba(37,99,235,0.3)] animate-in slide-in-from-bottom-1" />
                        )}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full bg-white border-2 border-transparent focus:border-blue-600/20 shadow-sm rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {activeTab === 'payments' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatsCard title="Total Volume (Real-time)" value={`₹${totalVolume.toLocaleString()}`} subtext="Live" icon={TrendingUp} badge="Live" badgeColor="bg-emerald-50 text-emerald-600" />
                    <div className="flex-1 w-full bg-blue-50/50 border border-blue-100 rounded-[28px] p-6 flex items-center justify-between group hover:border-blue-300 transition-all">
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Success Rate</p>
                            <p className="text-3xl font-black text-blue-900 leading-none">{successRate}%</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <StatsCard title="Failed Transactions" value={failedTransactions.toString()} subtext="Action Req." icon={AlertCircle} badge={failedTransactions > 0 ? "Action Req." : "Clear"} badgeColor={failedTransactions > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"} />
                </div>
            )}

            {activeTab === 'refunds' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl">
                    <StatsCard title="Total Refund Volume" value={`₹${totalRefundVolume.toLocaleString()}`} subtext="Returned" icon={RotateCcw} badge="Returned" badgeColor="bg-blue-50 text-blue-600" />
                    <StatsCard title="Total Refund Count" value={refundedOrders.length.toString()} subtext="Items" icon={RotateCcw} />
                </div>
            )}

            {activeTab === 'taxes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-4xl">
                    <StatsCard title="Total GST Collected (on fees)" value={`₹${totalGst.toFixed(2)}`} subtext="Compliant" icon={DollarSign} badge="Compliant" badgeColor="bg-emerald-50 text-emerald-600" />
                    <StatsCard title="Total Gateway Fee" value={`₹${totalGatewayFee.toFixed(2)}`} subtext="Net Fees" icon={Briefcase} />
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-10">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab} LIST</h2>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                    {activeTab === 'payments' && (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {successfulOrders.length > 0 ? successfulOrders.map((p) => (
                                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">{p.paymentResult?.id || `req_${p._id.substring(0, 6)}`}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500">{new Date(p.paidAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-900">order_{p._id.substring(0, 8)}</td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-black text-slate-900 tracking-tight">₹{p.totalPrice.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{p.user?.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400">{p.user?.phoneNumber || p.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                SUCCESSFUL
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-6 text-center text-slate-400 font-medium">No successful payments found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'refunds' && (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {refundedOrders.length > 0 ? refundedOrders.map((r) => (
                                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">{r.paymentResult?.id || `req_${r._id.substring(0, 6)}`}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-500">{new Date(r.updatedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-900">order_{r._id.substring(0, 8)}</td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-black text-slate-900 tracking-tight">₹{r.totalPrice.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{r.user?.name}</span>
                                                <span className="text-[10px] font-medium text-slate-400">{r.user?.phoneNumber || r.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                REFUNDED
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-6 text-center text-slate-400 font-medium">No refunded orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'taxes' && (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Base Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Gateway Fee</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">GST (18%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {taxes.length > 0 ? taxes.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-900">{t.id}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-bold text-slate-500">₹{t.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-bold text-blue-500">-₹{t.fee.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-bold text-blue-500">-₹{t.gst.toFixed(2)}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="py-6 text-center text-slate-400 font-medium">No tax data found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div >
    );
};

export default PaymentsFinanceScreen;

const RotateCcw = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
);

const Briefcase = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
