import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';

interface FeeStructure {
    id: number;
    title: string;
    amount: number;
    category: string;
    academic_year: string;
}

const FeeManagement: React.FC = () => {
    const [fees, setFees] = useState<FeeStructure[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFee, setNewFee] = useState({
        title: '',
        amount: '',
        category: 'Tuition',
        academic_year: '2023-24'
    });

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/fees/structure');
            const data = await res.json();
            setFees(data);
        } catch (err) {
            console.error(err);
        } finally {
            // Loading finished
        }
    };

    const handleAddFee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/fees/structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFee)
            });
            if (res.ok) {
                fetchFees();
                setShowAddModal(false);
                setNewFee({ title: '', amount: '', category: 'Tuition', academic_year: '2023-24' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFee = async (id: number) => {
        if (!confirm('Are you sure you want to delete this fee structure?')) return;
        try {
            await fetch(`http://localhost:5000/api/fees/structure/${id}`, { method: 'DELETE' });
            fetchFees();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">College Fee Structure</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage and define global college fees</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Define New Fee
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fees.map((fee) => (
                    <div key={fee.id} className="glass-panel p-6 rounded-3xl border border-white/40 dark:border-slate-800 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDeleteFee(fee.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                                <DollarSign size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{fee.title}</h3>
                                <p className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{parseFloat(fee.amount as any).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{fee.category}</span>
                            <span>A.Y {fee.academic_year}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white dark:border-slate-800">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Assign New Fee Category</h2>
                        <form onSubmit={handleAddFee} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Fee Title</label>
                                <input 
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all font-semibold"
                                    placeholder="e.g., Annual Tuition Fee"
                                    value={newFee.title}
                                    onChange={(e) => setNewFee({...newFee, title: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Amount (₹)</label>
                                    <input 
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all font-semibold"
                                        placeholder="0.00"
                                        value={newFee.amount}
                                        onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Academic Year</label>
                                    <input 
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all font-semibold"
                                        value={newFee.academic_year}
                                        onChange={(e) => setNewFee({...newFee, academic_year: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Category</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all font-semibold"
                                    value={newFee.category}
                                    onChange={(e) => setNewFee({...newFee, category: e.target.value})}
                                >
                                    <option>Tuition</option>
                                    <option>Hostel</option>
                                    <option>Admission</option>
                                    <option>Library</option>
                                    <option>Sports</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors">Assign Fee</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeManagement;
