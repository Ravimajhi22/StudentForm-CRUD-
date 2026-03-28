export interface Student {
  id: number;
  name: string;
  address: string;
  state: string;
  district: string;
  pincode: string;
  image?: string;
  certificate?: string;
  country?: string;
  phone?: string;
  email?: string;
  age?: number;
  dob?: string;
  gender?: string;
  father_name?: string;
  mother_name?: string;
  blood_group?: string;
  adhar_number?: string;
  country_code?: string;
  branch_id?: number;
  course_id?: number;
  branch_name?: string;
  course_name?: string;
}

export interface Course {
  id: number;
  branch_id: number;
  name: string;
  syllabus_pdf?: string;
  branch_name?: string;
}

export interface Exam {
  id: number;
  exam_name: string;
  course_id: number;
  course_name?: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_number?: string;
  total_marks: number;
  description?: string;
  created_at?: string;
}
