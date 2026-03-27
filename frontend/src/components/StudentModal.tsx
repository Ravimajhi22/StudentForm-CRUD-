import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { Student } from '../types';

interface LocationData {
  state: string;
  districts: string[];
}

const MOCK_LOCATIONS: LocationData[] = [
  { state: 'Maharashtra', districts: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'] },
  { state: 'Karnataka', districts: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belgaum'] },
  { state: 'Andhra Pradesh', districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'] },
  { state: 'Delhi', districts: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi'] },
  { state: 'Tamil Nadu', districts: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
  { state: 'Kerala', districts: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'] }
];

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (data: Omit<Student, 'id'> | Student) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    state: '',
    district: '',
    pincode: '',
    image: '',
    certificate: '',
  });

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        address: student.address,
        state: student.state,
        district: student.district,
        pincode: student.pincode,
        image: student.image || '',
        certificate: student.certificate || '',
      });
    }
  }, [student]);

  useEffect(() => {
    if (formData.state) {
      const loc = MOCK_LOCATIONS.find(l => l.state === formData.state);
      if (loc) {
        setAvailableDistricts(loc.districts);
        if (!loc.districts.includes(formData.district)) {
          setFormData(prev => ({ ...prev, district: '' }));
        }
      } else {
        setAvailableDistricts([]);
      }
    }
  }, [formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'certificate') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(student ? { ...formData, id: student.id } : formData);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 dark:bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[24px] shadow-[0_24px_60px_rgb(0,0,0,0.12)] dark:shadow-[0_24px_60px_rgb(0,0,0,0.4)] w-full max-w-[560px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/80 dark:border-slate-700/80 flex flex-col relative transition-colors duration-500"
      >
        <div className="px-6 py-4 border-b border-slate-100/80 dark:border-slate-700/50 flex justify-between items-start bg-gradient-to-r from-blue-50/30 dark:from-slate-800/80 to-transparent relative overflow-hidden flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {student ? 'Edit Record' : 'Register Student'}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {student ? 'Update the details for this student below.' : 'Enter the official details to enrol a new student.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Legal Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 outline-none focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-indigo-500/20 transition-all text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-slate-50/50 dark:bg-slate-800/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none focus:bg-white dark:focus:bg-slate-800 focus:shadow-sm"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Permanent Address</label>
            <textarea
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 outline-none focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-indigo-500/20 transition-all resize-none text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-slate-50/50 dark:bg-slate-800/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none focus:bg-white dark:focus:bg-slate-800 focus:shadow-sm"
              placeholder="Apartment, Street, Area"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">State Region</label>
              <select
                required
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 outline-none focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-indigo-500/20 transition-all bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 appearance-none cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none focus:bg-white dark:focus:bg-slate-800 focus:shadow-sm text-sm font-semibold"
              >
                <option value="" disabled>Select state</option>
                {MOCK_LOCATIONS.map(loc => (
                  <option key={loc.state} value={loc.state}>{loc.state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Local District</label>
              <select
                required
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.state}
                className="w-full px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 outline-none focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-indigo-500/20 transition-all bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 disabled:bg-slate-100/50 dark:disabled:bg-slate-800/20 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed appearance-none cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none focus:bg-white dark:focus:bg-slate-800 focus:shadow-sm text-sm font-semibold"
              >
                <option value="" disabled>Select district</option>
                {availableDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Student Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image')}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-sm bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none focus:bg-white dark:focus:bg-slate-800 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-indigo-500/20 file:text-blue-700 dark:file:text-indigo-300 hover:file:bg-blue-100 dark:hover:file:bg-indigo-500/30 transition-all cursor-pointer outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              />
              {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-12 w-12 object-cover rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" />}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Certificate (Optional)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'certificate')}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-sm bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none focus:bg-white dark:focus:bg-slate-800 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-indigo-500/20 file:text-blue-700 dark:file:text-indigo-300 hover:file:bg-blue-100 dark:hover:file:bg-indigo-500/30 transition-all cursor-pointer outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              />
              {formData.certificate && <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-500/20 font-semibold inline-flex items-center gap-1"><Check size={12} />Attached</div>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Postal Number / Pincode</label>
            <input
              required
              type="text"
              name="pincode"
              pattern="[0-9]{5,6}"
              title="5 or 6 digit postal code"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 outline-none focus:border-blue-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-blue-500/15 dark:focus:ring-indigo-500/20 transition-all font-mono text-sm tracking-widest text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-slate-50/50 dark:bg-slate-800/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none focus:bg-white dark:focus:bg-slate-800 focus:shadow-sm"
              placeholder="110001"
              maxLength={6}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:shadow-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 bg-gradient-to-b from-blue-500 to-blue-600 dark:from-indigo-600 dark:to-indigo-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 shadow-[0_4px_14px_0_rgb(59,130,246,0.39)] dark:shadow-none hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] border border-blue-400/50 dark:border-indigo-500/50 transition-all disabled:opacity-50 active:scale-95"
            >
              <Check size={18} strokeWidth={2.5} />
              {isSubmitting ? 'Processing...' : (student ? 'Save Changes' : 'Confirm Registration')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
