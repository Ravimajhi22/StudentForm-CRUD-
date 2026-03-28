import React, { useState, useEffect } from 'react';
import { X, DollarSign, Receipt, AlertCircle, CheckCircle, ShieldCheck, User, TrendingUp } from 'lucide-react';
import type { Student } from '../types';

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
            const res = await fetch(`http://localhost:5000/api/fees/student/${student.id}`);
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
            const res = await fetch(`http://localhost:5000/api/fees/student/${student.id}`, {
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
            await fetch(`http://localhost:5000/api/fees/student/${student.id}`, {
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-navy-950 text-white rounded">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Ledger Operations</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Financial Reconciliation System</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-10 space-y-10">
                    <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
                        {student.image ? (
                            <img src={student.image} alt={student.name} className="w-16 h-16 rounded border-2 border-white shadow-sm object-cover" />
                        ) : (
                            <div className="w-16 h-16 rounded bg-navy-950 flex items-center justify-center text-white font-black text-2xl">
                                {student.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{student.name}</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-600 dark:text-navy-400">Account ID: STU-{1000 + student.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Debit Amount</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">₹{parseFloat(feeData.total_amount as any).toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">Credit Settled</p>
                            <p className="text-xl font-black">₹{parseFloat(feeData.paid_amount as any).toLocaleString()}</p>
                        </div>
                        <div className={`p-6 rounded-xl border ${balance > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-navy-50 text-navy-600 border-navy-100'}`}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">Current Yield</p>
                            <p className="text-xl font-black">₹{parseFloat(balance as any).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Institutional Fee Mapping</label>
                            <div className="flex flex-wrap gap-3">
                                {[5000, 15000, 35000, 55000].map(amt => (
                                    <button 
                                        key={amt}
                                        onClick={() => handleSetTotal(amt)}
                                        className="px-5 py-2.5 rounded border border-slate-200 dark:border-slate-800 hover:border-navy-600 hover:text-navy-600 text-[11px] font-black text-slate-500 transition-all font-mono active:scale-95"
                                    >
                                        SET ₹{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleRecordPayment} className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Record Transaction</label>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        className="input-formal w-full pl-12 pr-6 py-4 text-xl font-black text-slate-900"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting || !paymentAmount}
                                    className="px-8 py-4 bg-navy-950 text-white rounded-lg font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 flex items-center gap-2 border border-navy-800 disabled:opacity-50"
                                >
                                    <Receipt size={18} />
                                    Submit Transaction
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={`p-4 rounded border flex items-center justify-between ${feeData.status === 'Paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                        <div className="flex items-center gap-3">
                           {feeData.status === 'Paid' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                           <span className="text-[10px] font-black uppercase tracking-widest">System Status Index</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded shadow-sm">{feeData.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentFeeModal;
