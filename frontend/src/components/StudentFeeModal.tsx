import React, { useState, useEffect } from 'react';
import { X, DollarSign, Receipt, AlertCircle, CheckCircle, ShieldCheck, User, TrendingUp } from 'lucide-react';
import type { Student } from '../types';
import { API_URL } from '../apiConfig';


interface StudentFeeModalProps {
    student: Student;
    onClose: () => void;
    onUpdate: () => void;
}

const StudentFeeModal: React.FC<StudentFeeModalProps> = ({ student, onClose, onUpdate }) => {
    const [feeData, setFeeData] = useState({
        total_amount: 0,
        paid_amount: 0,
        status: 'Pending'
    });
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchStudentFees();
    }, [student.id]);

    const fetchStudentFees = async () => {
        try {
            const res = await fetch(`${API_URL}/api/fees/student/${student.id}`);

            const data = await res.json();
            setFeeData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const newPaid = feeData.paid_amount + parseFloat(paymentAmount);
            const res = await fetch(`${API_URL}/api/fees/student/${student.id}`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total_amount: feeData.total_amount || 0,
                    paid_amount: newPaid
                })
            });
            if (res.ok) {
                fetchStudentFees();
                setPaymentAmount('');
                onUpdate();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSetTotal = async (amount: number) => {
        try {
            await fetch(`${API_URL}/api/fees/student/${student.id}`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total_amount: amount,
                    paid_amount: feeData.paid_amount
                })
            });
            fetchStudentFees();
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const balance = feeData.total_amount - feeData.paid_amount;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="p-2 sm:p-2.5 bg-navy-950 text-white rounded flex-shrink-0">
                            <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Ledger Operations</h2>
                            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Financial Reconciliation System</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
                        {student.image ? (
                            <img src={student.image} alt={student.name} className="w-12 sm:w-16 h-12 sm:h-16 rounded border-2 border-white shadow-sm object-cover" />
                        ) : (
                            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded bg-navy-950 flex items-center justify-center text-white font-black text-lg sm:text-2xl">
                                {student.name.charAt(0)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 truncate">{student.name}</h2>
                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-navy-600 dark:text-navy-400 truncate">Account ID: STU-{1000 + student.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Debit Amount</p>
                            <p className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white truncate">₹{parseFloat(feeData.total_amount as any).toLocaleString()}</p>
                        </div>
                        <div className="p-4 sm:p-6 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">Credit Settled</p>
                            <p className="text-base sm:text-lg lg:text-xl font-black truncate">₹{parseFloat(feeData.paid_amount as any).toLocaleString()}</p>
                        </div>
                        <div className={`p-4 sm:p-6 rounded-xl border ${balance > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-navy-50 text-navy-600 border-navy-100'}`}>
                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">Current Yield</p>
                            <p className="text-base sm:text-lg lg:text-xl font-black truncate">₹{parseFloat(balance as any).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 block">Institutional Fee Mapping</label>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {[5000, 15000, 35000, 55000].map(amt => (
                                    <button 
                                        key={amt}
                                        onClick={() => handleSetTotal(amt)}
                                        className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded border border-slate-200 dark:border-slate-800 hover:border-navy-600 hover:text-navy-600 text-[9px] sm:text-[11px] font-black text-slate-500 transition-all font-mono active:scale-95 whitespace-nowrap"
                                    >
                                        SET ₹{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleRecordPayment} className="space-y-3 sm:space-y-4">
                            <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 block">Record Transaction</label>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="relative flex-1">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        className="input-formal w-full pl-12 pr-6 py-3 sm:py-4 text-base sm:text-lg font-black text-slate-900 rounded-lg"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting || !paymentAmount}
                                    className="px-4 sm:px-8 py-3 sm:py-4 bg-navy-950 text-white rounded-lg font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 flex items-center justify-center sm:justify-start gap-2 border border-navy-800 disabled:opacity-50 whitespace-nowrap"
                                >
                                    <Receipt size={16} />
                                    <span className="hidden sm:inline">Submit Transaction</span>
                                    <span className="sm:hidden">Submit</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={`p-3 sm:p-4 rounded border flex items-center justify-between gap-3 ${feeData.status === 'Paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                           {feeData.status === 'Paid' ? <CheckCircle size={16} className="flex-shrink-0" /> : <AlertCircle size={16} className="flex-shrink-0" />}
                           <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest truncate">System Status Index</span>
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-white px-2 sm:px-3 py-1 rounded shadow-sm whitespace-nowrap">{feeData.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentFeeModal;
