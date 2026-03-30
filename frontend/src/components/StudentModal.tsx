import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, ChevronDown, User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import type { Student } from '../types';

import { LOCATIONS } from '../data/locations';
import { COUNTRY_CODES } from '../data/countryCodes';

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
    country_code: '+91',
    country: '', 
    address: '',
    state: '',
    district: '',
    pincode: '',
    image: '',
    certificate: '',
  });


  const [isCodeDropdownOpen, setIsCodeDropdownOpen] = useState(false);

  const [imagePreview, setImagePreview] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        dob: student.dob ? student.dob.split('T')[0] : '',
        age: student.age || '',
        gender: student.gender || '',
        father_name: student.father_name || '',
        mother_name: student.mother_name || '',
        blood_group: student.blood_group || '',
        country_code: student.country_code || '+91',
        country: student.country || '',
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
      if (!districts.includes(formData.district)) {
        setFormData((prev: any) => ({ ...prev, district: '' }));
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.country, formData.state]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (formData.pincode.length === 6 && formData.country === 'India') {
        setIsPincodeLoading(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await response.json();
          if (data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            const state = postOffice.State;
            const district = postOffice.District;
            if (LOCATIONS['India'][state]) {
              setFormData((prev: any) => ({
                ...prev,
                state: state,
                district: LOCATIONS['India'][state].includes(district) ? district : prev.district
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching pincode data:', error);
        } finally {
          setIsPincodeLoading(false);
        }
      }
    };
    const timer = setTimeout(fetchAddress, 500);
    return () => clearTimeout(timer);
  }, [formData.pincode, formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
      return;
    }
    if (name === 'pincode' && formData.country === 'India') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
      return;
    }
    if (name === 'dob') {
      const dobDate = new Date(value);
      const today = new Date();
      let calAge = today.getFullYear() - dobDate.getFullYear();
      if (today.getMonth() < dobDate.getMonth() || (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) calAge--;
      setFormData((prev: any) => ({ ...prev, dob: value, age: calAge >= 0 ? calAge.toString() : '' }));
      return;
    }
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'certificate') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      if (field === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Institutional Header - FIXED */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-navy-950 text-white rounded-lg">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {student ? 'Modify Individual Record' : 'Official Student Inscription'}
              </h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Institutional Governance & Regulatory Compliance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            
            {/* Section: Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Profile Media */}
              <div className="md:col-span-1 flex flex-col items-center">
                  <div className="relative group mb-3">
                    <div className="w-28 h-28 rounded bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-slate-300" />
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-2 bg-navy-950 text-white rounded-lg shadow-xl border border-navy-800 active:scale-95 transition-all"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleFileChange(e, 'image')} className="hidden" />
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Biometric Identity</p>
              </div>

              {/* Core Data */}
              <div className="md:col-span-3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="label-formal">Legal Full Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-formal w-full px-4 py-2.5 text-[12px] font-bold" placeholder="As per official documentation" />
                    </div>
                    <div>
                        <label className="label-formal">Date of Birth</label>
                        <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-formal w-full px-4 py-2.5 text-[12px] font-bold" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label-formal">Age</label>
                      <input required type="number" name="age" value={formData.age} onChange={handleChange} className="input-formal w-full px-4 py-2.5 text-[12px] font-bold" readOnly />
                    </div>
                    <div>
                      <label className="label-formal">Gender</label>
                      <select required name="gender" value={formData.gender} onChange={handleChange} className="input-formal w-full px-4 py-2.5 text-[12px] font-bold appearance-none">
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
               <div>
                  <label className="label-formal">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-formal w-full pl-10 pr-4 py-2.5 text-[12px] font-bold" placeholder="jane@institute.edu" />
                  </div>
               </div>
               <div>
                  <label className="label-formal">Contact Protocol</label>
                  <div className="flex gap-2">
                    <div className="relative">
                        <button type="button" onClick={() => setIsCodeDropdownOpen(!isCodeDropdownOpen)} className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-black text-slate-700 min-w-[70px]">
                          {formData.country_code} <ChevronDown size={14} className="text-slate-400" />
                        </button>
                        {isCodeDropdownOpen && (
                          <div className="absolute top-full left-0 mt-2 w-64 max-h-48 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 overflow-y-auto custom-scrollbar">
                             {COUNTRY_CODES.map(c => (
                               <button key={c.iso} type="button" onClick={() => { setFormData({...formData, country_code: c.code}); setIsCodeDropdownOpen(false); }} className="w-full px-4 py-2 text-left hover:bg-slate-50 text-[11px] font-bold flex justify-between border-b border-slate-50 last:border-0 uppercase tracking-tighter">
                                 <span>{c.name}</span> <span className="text-navy-600">{c.code}</span>
                               </button>
                             ))}
                          </div>
                        )}
                    </div>
                    <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10} className="input-formal w-full pl-10 pr-4 py-2.5 text-[12px] font-bold" placeholder="10 Digit Number" />
                    </div>
                  </div>
               </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="label-formal">Parental Nomenclature</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="input-formal w-full px-4 py-2.5 text-[12px] font-bold" placeholder="Father's Name" />
                    <input required type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} className="input-formal w-full px-4 py-2.5 text-[12px] font-bold" placeholder="Mother's Name" />
                  </div>
               </div>
               <div>
                  <label className="label-formal">Permanent Domicile (Address)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={14} />
                    <textarea required name="address" value={formData.address} onChange={handleChange} rows={1} className="input-formal w-full pl-10 pr-4 py-3 text-[12px] font-bold resize-none" placeholder="Complete institutional address..." />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                  <label className="label-formal">Nationality</label>
                  <select required name="country" value={formData.country} onChange={handleChange} className="input-formal w-full px-3 py-2.5 text-[12px] font-bold appearance-none">
                    <option value="" disabled>Country</option>
                    {Object.keys(LOCATIONS).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
              <div>
                  <label className="label-formal">State/Region</label>
                  <select required name="state" value={formData.state} onChange={handleChange} disabled={!formData.country} className="input-formal w-full px-3 py-2.5 text-[12px] font-bold appearance-none">
                    <option value="" disabled>State</option>
                    {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
              </div>
              <div>
                  <label className="label-formal">District</label>
                  <select required name="district" value={formData.district} onChange={handleChange} disabled={!formData.state} className="input-formal w-full px-3 py-2.5 text-[12px] font-bold appearance-none">
                    <option value="" disabled>District</option>
                    {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
              </div>
              <div>
                  <label className="label-formal">PIN Code {isPincodeLoading && '...'}</label>
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} className="input-formal w-full px-3 py-2.5 text-[12px] font-bold" placeholder="6-Digit" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded border border-slate-200">
                        <Upload size={16} className="text-slate-400" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none">Academic Credentials</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">PDF/Image Secured</p>
                     </div>
                  </div>
                  <button type="button" onClick={() => certInputRef.current?.click()} className="px-4 py-2 bg-white text-navy-600 border border-navy-100 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-navy-50 transition-all">
                    {formData.certificate ? 'Replace' : 'Upload'}
                  </button>
                  <input type="file" accept=".pdf,image/*" ref={certInputRef} onChange={(e) => handleFileChange(e, 'certificate')} className="hidden" />
               </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-4 flex-shrink-0">
             <button type="button" onClick={onClose} className="flex-1 py-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50 transition-colors">Discard</button>
             <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-navy-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-navy-950/25 active:scale-95 transition-all border border-navy-800 disabled:opacity-50">
               {isSubmitting ? 'Finalizing...' : (student ? 'Update Record' : 'Confirm Inscription')}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
