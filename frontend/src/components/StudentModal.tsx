import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, Search, ChevronDown } from 'lucide-react';
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
    adhar_number: '',
    country_code: '+91',
    country: '', // default to empty for selection
    address: '',
    state: '',
    district: '',
    pincode: '',
    image: '',
    certificate: '',
    branch_id: '',
    course_id: '',
  });

  const [branches, setBranches] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  const [isCodeDropdownOpen, setIsCodeDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');

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
        dob: student.dob ? student.dob.split('T')[0] : '', // format date if needed
        age: student.age || '',
        gender: student.gender || '',
        father_name: student.father_name || '',
        mother_name: student.mother_name || '',
        blood_group: student.blood_group || '',
        adhar_number: student.adhar_number || '',
        country_code: student.country_code || '+91',
        country: student.country || '',
        address: student.address || '',
        state: student.state || '',
        district: student.district || '',
        pincode: student.pincode || '',
        image: student.image || '',
        certificate: student.certificate || '',
        branch_id: student.branch_id || '',
        course_id: student.course_id || '',
      });
      setImagePreview(student.image || '');
      if (student.branch_id) fetchCourses(student.branch_id);
    }
  }, [student]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/academic/branches');
      const data = await res.json();
      setBranches(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async (branchId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/academic/branch/${branchId}`);
      const data = await res.json();
      setFilteredCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

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

  // Automated Pincode Lookup
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
            
            // Map common API state names to our LOCATIONS keys if they differ
            const stateMap: { [key: string]: string } = {
              "Odisha": "Odisha",
              "Tamil Nadu": "Tamil Nadu"
              // Add more mappings if needed
            };
            
            const mappedState = stateMap[state] || state;
            
            if (LOCATIONS['India'][mappedState]) {
              setFormData((prev: any) => ({
                ...prev,
                state: mappedState,
                district: LOCATIONS['India'][mappedState].includes(district) ? district : prev.district
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

    const timer = setTimeout(() => {
      fetchAddress();
    }, 500); // debounce

    return () => clearTimeout(timer);
  }, [formData.pincode, formData.country]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Strict 10-digit numeric validation for phone fields
    if (name === 'phone' || name === 'emergency_contact') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
      return;
    }

    // Pincode validation (6 digits for India)
    if (name === 'pincode' && formData.country === 'India') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
      return;
    }

    // Aadhaar number validation (12 digits)
    if (name === 'adhar_number') {
      const numericValue = value.replace(/\D/g, '').slice(0, 12);
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
      return;
    }

    // Automated Age Calculation from DOB
    if (name === 'dob') {
      const dobDate = new Date(value);
      const today = new Date();
      let calAge = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        calAge--;
      }
      
      setFormData((prev: any) => ({ 
        ...prev, 
        dob: value, 
        age: calAge >= 0 ? calAge.toString() : '' 
      }));
      return;
    }

    if (name === 'branch_id') {
      const bId = value;
      setFormData((prev: any) => ({ ...prev, branch_id: bId, course_id: '' }));
      if (bId) fetchCourses(parseInt(bId));
      else setFilteredCourses([]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:pl-72 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-[24px] shadow-2xl w-full max-w-[700px] my-auto relative animate-in zoom-in-95 duration-300 flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Close Button Top Right */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 flex flex-col items-center">
          
          {/* Header section identical to reference */}
          <div className="w-full mb-4 text-left sm:text-center mt-0">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-sky-400">
              Student Registration
            </h2>
            <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 italic">
              expertise you can trust
            </p>
          </div>

          {/* Centered Photo Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-[2px] border-slate-50 dark:border-slate-700 flex items-center justify-center overflow-hidden mb-1.5 shadow-sm relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="text-white" size={14} />
              </div>
            </div>
            
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-[11px] hover:bg-[#fefce8] dark:hover:bg-sky-500/10 transition-all focus:outline-none"
            >
              <Camera size={12} />
              Set Photo
            </button>
          </div>

          <div className="w-full space-y-3">
            <div className="border-t border-slate-100 dark:border-slate-800/80 mb-3 w-full absolute left-0"></div>

            {/* Inputs Layout */}
            <div className="w-full pt-1">
              <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Student Full Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                placeholder="e.g., Jane Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Date of Birth</label>
                <input
                  required
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Age</label>
                <input
                  required
                  type="number"
                  name="age"
                  min="1"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="e.g., 20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Gender</label>
                <select
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
               <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">College Branch</label>
                <select
                  required
                  name="branch_id"
                  value={formData.branch_id}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Assigned Course</label>
                <select
                  required
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
                  disabled={!formData.branch_id}
                >
                  <option value="">Select Course</option>
                  {filteredCourses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Email ID</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="e.g., jane.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Contact Number</label>
                <div className="flex gap-1.5 relative">
                  {/* Searchable Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCodeDropdownOpen(!isCodeDropdownOpen)}
                      className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#f4f5f8] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all text-[13px] font-bold text-slate-700 dark:text-slate-200 min-w-[70px] h-full shadow-sm"
                    >
                      <span>{formData.country_code}</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform ${isCodeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCodeDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 max-h-60 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[100] animate-in zoom-in-95 duration-200">
                        <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                          <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              autoFocus
                              type="text"
                              value={codeSearch}
                              onChange={(e) => setCodeSearch(e.target.value)}
                              placeholder="Search country or code..."
                              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg text-[12px] font-medium outline-none border border-slate-200 dark:border-slate-700 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-48 scrollbar-premium">
                          {COUNTRY_CODES.filter(item => 
                            item.name.toLowerCase().includes(codeSearch.toLowerCase()) || 
                            item.code.includes(codeSearch)
                          ).map((item) => (
                            <button
                              key={`${item.iso}-${item.code}`}
                              type="button"
                              onClick={() => {
                                setFormData((prev: any) => ({ ...prev, country_code: item.code }));
                                setIsCodeDropdownOpen(false);
                                setCodeSearch('');
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-sky-50 dark:hover:bg-sky-900/20 flex items-center justify-between group border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded uppercase">{item.iso}</span>
                                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{item.name}</span>
                              </div>
                              <span className="text-[13px] font-black text-sky-600 dark:text-sky-400">{item.code}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="flex-grow px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                    placeholder="e.g., 9876543210"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Permanent Address</label>
              <textarea
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={1}
                className="w-full px-3 py-1.5 rounded-lg input-premium resize-none text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                placeholder="Include apartment, street, and area"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Blood Group</label>
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
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
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  name="adhar_number"
                  value={formData.adhar_number}
                  onChange={handleChange}
                  maxLength={12}
                  pattern="[0-9]{12}"
                  title="12 digit Aadhaar number"
                  className="w-full px-3 py-1.5 rounded-lg input-premium text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="xxxx-xxxx-xxxx"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Father's Name</label>
                <input
                  required
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-[13px] font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="Father's full name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Mother's Name</label>
                <input
                  required
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-[13px] font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Local District</label>
                <select
                  required
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-[13px] font-medium text-slate-900 dark:text-slate-100 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="" disabled>Select district</option>
                  {availableDistricts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">
                  Pincode {isPincodeLoading && <span className="text-sky-500 animate-pulse ml-1 text-[10px] font-medium">Fetching Area...</span>}
                </label>
                <input
                  required
                  type="text"
                  name="pincode"
                  pattern="[0-9]{5,6}"
                  title="5 or 6 digit postal code"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#f4f5f8] dark:bg-slate-800/80 border-0 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-[13px] font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  placeholder="e.g., 110001"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-900 dark:text-slate-300 mb-1">Certificate</label>
                <div 
                  onClick={() => certInputRef.current?.click()}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#f4f5f8] dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-600 outline-none hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between"
                >
                  <span className={`text-[13px] truncate font-medium ${formData.certificate ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    {formData.certificate ? 'Selected' : 'Upload File'}
                  </span>
                  <Upload size={14} className="text-slate-400 flex-shrink-0 ml-1" />
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

            <div className="pt-1.5 w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-[15px] btn-premium flex items-center justify-center gap-2 group shadow-sky-500/25"
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
