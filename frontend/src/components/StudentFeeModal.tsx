import React, { useState, useEffect } from 'react';
import { X, DollarSign, Receipt, AlertCircle, CheckCircle } from 'lucide-react';
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
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800 overflow-hidden relative">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="flex items-center gap-6 mb-10">
                        {student.image ? (
                            <img src={student.image} alt={student.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/10" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-black text-2xl">
                                {student.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">{student.name}</h2>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Financial Account • STU-{1000 + student.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Payable</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white">₹{parseFloat(feeData.total_amount as any).toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/10 dark:border-emerald-500/20">
                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">Amount Paid</p>
                            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{parseFloat(feeData.paid_amount as any).toLocaleString()}</p>
                        </div>
                        <div className={`p-6 rounded-3xl border ${balance > 0 ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/10 dark:border-rose-500/20' : 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/10 dark:border-blue-500/20'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${balance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>Current Balance</p>
                            <p className={`text-xl font-black ${balance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>₹{parseFloat(balance as any).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-4 block">Quick Action: Assign Total Fees</label>
                            <div className="flex flex-wrap gap-2">
                                {[5000, 15000, 35000, 55000].map(amt => (
                                    <button 
                                        key={amt}
                                        onClick={() => handleSetTotal(amt)}
                                        className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold text-slate-600 dark:text-slate-400 transition-all font-mono"
                                    >
                                        ₹{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleRecordPayment} className="relative">
                            <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-4 block">Record New Payment</label>
                            <div className="flex gap-4">
                                <div className="relative flex-grow">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input 
                                        type="number"
                                        required
                                        placeholder="Enter payment amount..."
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none transition-all font-black text-lg text-slate-900 dark:text-white"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting || !paymentAmount}
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Receipt size={20} />
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={`mt-10 p-4 rounded-2xl flex items-center gap-3 border ${feeData.status === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'}`}>
                        {feeData.status === 'Paid' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="text-xs font-black uppercase tracking-widest">Account Status: {feeData.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentFeeModal;
