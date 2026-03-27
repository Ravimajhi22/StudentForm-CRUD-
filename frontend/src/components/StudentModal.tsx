import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import type { Student } from '../types';

import { LOCATIONS } from '../data/locations';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    dob: '',
    age: '',
    gender: '',
    father_name: '',
    mother_name: '',
    blood_group: '',
    medical_status: '',
    emergency_contact: '',
    country: 'India', // default country
    address: '',
    state: '',
    district: '',
    pincode: '',
    image: '',
    certificate: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        dob: student.dob ? student.dob.split('T')[0] : '', // format date if needed
        age: student.age || '',
        gender: student.gender || '',
        father_name: student.father_name || '',
        mother_name: student.mother_name || '',
        blood_group: student.blood_group || '',
        medical_status: student.medical_status || '',
        emergency_contact: student.emergency_contact || '',
        country: student.country || 'India',
        address: student.address || '',
        state: student.state || '',
        district: student.district || '',
        pincode: student.pincode || '',
        image: student.image || '',
        certificate: student.certificate || '',
      });
      setImagePreview(student.image || '');
    }
  }, [student]);

  useEffect(() => {
    if (formData.country) {
      const states = Object.keys(LOCATIONS[formData.country] || {});
      setAvailableStates(states);
      // Reset state and district if the selection is invalid
      if (!states.includes(formData.state)) {
        setFormData((prev: any) => ({ ...prev, state: '', district: '' }));
      }
    } else {
      setAvailableStates([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      const districts = LOCATIONS[formData.country]?.[formData.state] || [];
      setAvailableDistricts(districts);
      // Reset district if it's not in the new list
      if (!districts.includes(formData.district)) {
        setFormData((prev: any) => ({ ...prev, district: '' }));
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.country, formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'certificate') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      if (field === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-[24px] shadow-2xl w-full max-w-[700px] my-auto relative animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Close Button Top Right */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 flex flex-col items-center">
          
          {/* Header section identical to reference */}
          <div className="w-full mb-10 text-left sm:text-center mt-2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-white dark:to-indigo-300">
              Student Registration
            </h2>
            <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400">
              Complete the registration by providing the details below.
            </p>
          </div>

          {/* Centered Photo Upload */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 border-[3px] border-slate-50 dark:border-slate-700 flex items-center justify-center overflow-hidden mb-4 shadow-sm relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="text-white" size={24} />
              </div>
            </div>
            
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">Profile Photo</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px] text-center mb-4 leading-relaxed">
              Upload a clear photo of the student for identification purposes
            </p>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e, 'image')}
              className="hidden" 
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all focus:outline-none"
            >
              <Camera size={18} />
              Upload Photo
            </button>
          </div>

          <div className="w-full space-y-6">
            <div className="border-t border-slate-100 dark:border-slate-800/80 mb-6 w-full absolute left-0"></div>

            {/* Inputs Layout */}
            <div className="w-full pt-4">
              <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Student Full Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                placeholder="e.g., Jane Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
              <div>
                <input
                  required
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Age</label>
                <input
                  required
                  type="number"
                  name="age"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="e.g., 20"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Gender</label>
                <select
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Email ID</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="e.g., jane.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Contact Number</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="e.g., +1 123 456 7890"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Permanent Address</label>
              <textarea
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-5 py-4 rounded-2xl input-premium resize-none text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                placeholder="Include apartment, street, and area"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Blood Group</label>
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                >
                  <option value="">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Medical Status</label>
                <input
                  type="text"
                  name="medical_status"
                  value={formData.medical_status}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="Health notes"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Emergency Contact</label>
                <input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl input-premium text-[15px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="Contact number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Father's Name</label>
                <input
                  required
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-[15px] font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="Father's full name"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Mother's Name</label>
                <input
                  required
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-[15px] font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="Mother's full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Country</label>
                <select
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-[15px] font-medium text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select country</option>
                  {Object.keys(LOCATIONS).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">State Region</label>
                <select
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!formData.country || !availableStates.length}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-[15px] font-medium text-slate-900 dark:text-slate-100 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>Select state</option>
                  {availableStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Local District</label>
                <select
                  required
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-[15px] font-medium text-slate-900 dark:text-slate-100 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>Select district</option>
                  {availableDistricts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Pincode</label>
                <input
                  required
                  type="text"
                  name="pincode"
                  pattern="[0-9]{5,6}"
                  title="5 or 6 digit postal code"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-[15px] font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="e.g., 110001"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-slate-900 dark:text-slate-300 mb-2">Certificate</label>
                <div 
                  onClick={() => certInputRef.current?.click()}
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-600 outline-none hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between"
                >
                  <span className={`text-[15px] truncate font-medium ${formData.certificate ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                    {formData.certificate ? 'Selected' : 'Upload File'}
                  </span>
                  <Upload size={18} className="text-slate-400 flex-shrink-0 ml-2" />
                </div>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  ref={certInputRef}
                  onChange={(e) => handleFileChange(e, 'certificate')}
                  className="hidden" 
                />
              </div>
            </div>

            <div className="pt-6 w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-[22px] text-[17px] btn-premium flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? 'Processing...' : (student ? 'SAVE CHANGES' : 'CONFIRM REGISTRATION')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
