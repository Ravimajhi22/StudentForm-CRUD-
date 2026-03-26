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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(student ? { ...formData, id: student.id } : formData);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[24px] shadow-2xl w-full max-w-[560px] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-200/60 flex flex-col"
      >
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {student ? 'Edit Record' : 'Register Student'}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {student ? 'Update the details for this student below.' : 'Enter the official details to enrol a new student.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Legal Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white shadow-sm"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Permanent Address</label>
            <textarea
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-sm font-semibold text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white shadow-sm"
              placeholder="Apartment, Street, Area"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">State Region</label>
              <select
                required
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-slate-50 focus:bg-white text-sm font-semibold text-slate-900 appearance-none cursor-pointer shadow-sm"
              >
                <option value="" disabled>Select state</option>
                {MOCK_LOCATIONS.map(loc => (
                  <option key={loc.state} value={loc.state}>{loc.state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Local District</label>
              <select
                required
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.state}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/80 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-slate-50 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-sm font-semibold text-slate-900 appearance-none cursor-pointer shadow-sm"
              >
                <option value="" disabled>Select district</option>
                {availableDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Postal Number / Pincode</label>
            <input
              required
              type="text"
              name="pincode"
              pattern="[0-9]{5,6}"
              title="5 or 6 digit postal code"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono text-sm tracking-widest text-slate-900 placeholder-slate-400 bg-slate-50 focus:bg-white shadow-sm"
              placeholder="110001"
              maxLength={6}
            />
          </div>

          <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-95 border border-indigo-600"
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
