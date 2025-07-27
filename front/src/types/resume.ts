// 기타 개인 정보
export interface PersonalData {
  name: string;
  birth_date: string;
  gender: string;
  address: string;
  phone: string;
  current_salary: string;
  desired_salary: string;
}

// 학력 항목
export interface EducationItem {
  school_name: string;
  major: string;
  graduation_status: string;
  degree: string;
  exam_passed: boolean;
}

// 경력 항목
export interface CareerItem {
  company: string;
  position: string;
  description: string;
  isCurrent: boolean;
  start_year: string;
  end_year?: string;
}

// 자격증 항목
export interface CertificateItem {
  issued_date: string;
  certificate_name: string;
  certificate_number: string;
}

// 기술 스택
export interface Skill {
  skill: string;
}

// 맞춤기업 TEST
export interface CompanyTest {
  Evaluation: number;
  PayLevel: number;
  VisionDirection: number;
  Welfare: number;
  Workload: number;
  TeamCulture: number;
}

// 기타 항목
export interface OtherInfoItem {
  note: string;
}

export interface OtherInfoValue {
  otherinfo: string; // JSON.stringify된 문자열
}

// 이력서 전체 폼 데이터 구조 (서버에 보낼 데이터)
export interface ResumeFormData {
  personalData: PersonalData;
  education: EducationItem[];
  career: CareerItem[];
  certificates: CertificateItem[];
  skills: Skill[];
  otherinfo: OtherInfoValue[];
  companyTest: CompanyTest | null;
}

// 이력서 입력 상태 타입
export interface ResumeState {
  personalData: PersonalData;
  education: EducationItem[];
  career: CareerItem[];
  certificates: CertificateItem[];
  skills: Skill[];
  otherinfo: OtherInfoValue;
  companyTest: CompanyTest | string | null;
}
