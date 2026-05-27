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
  date_end: string;
  wage: number;
  performance_salary: number;
  shift_meal_allowance: number;
  fuel_allowance: number;
  phone_allowance: number;
  travel_allowance: number;
  performance_bonus: number;
  negotiable_income: number;
  computer_allowance: number;
  tools_allowance: number;
  concurrent_allowance: number;
  nigth_shift_allowance: number;
  accommodation_allowance: number;
  cashier_allowance: number;
  road_allowance: number;
  special_allowance: number;
  overtime_allowance: number;
  other_one_allowance: number;
  other_two_allowance: number;
  other_three_allowance: number;
  total_salary: number;
}

interface UserApprovalInfor {
  approve_hr_attendance_explanation: boolean;
  approve_hr_leave: boolean;
  approve_resignation_letter: boolean;
}
