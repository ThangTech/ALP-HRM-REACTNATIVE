interface LoginRequest {
  username: string;
  password: string;
  db: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface Contract {
  contract_id: number;
  contract_name: string;
  contract_type_id: number;
  contract_type_name: string;
  date_start: string;
  time_contract: string;
  date_end: string | false;
  wage: number;
  shift_meal_allowance: number;
  fuel_allowance: number;
  phone_allowance: number;
  travel_allowance: number;
  social_insurance_amount: number;
  day_rate: number;
  fixed_rate_salary: number;
  tools_allowance: number;
  total_allowance: number;
  negotiable_income: number;
  total_salary: number;
}

interface UserApprovalInfor {
  approve_hr_attendance_explanation: boolean;
  approve_hr_leave: boolean;
  approve_resignation_letter: boolean;
}
