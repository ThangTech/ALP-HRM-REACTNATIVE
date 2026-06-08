interface AppContext {
  lang: string;
  fcmToken?: string;
  theme: 'dark' | 'light' | 'default';
  factory?: Factory;
  user?: User;
  permission?: {
    id: number;
    code: string;
    name: string;
  }[];
  bluetooth?: {
    isConnected: boolean;
    device: BluetoothDevice;
  };
  current_company_id?: number;
  setTheme: (v: AppContext['theme']) => Promise<void>;
  setLang: (v: AppContext['lang'], restart?: boolean) => Promise<void>;
  setUser: (v: AppContext['user']) => Promise<void>;
  setBluetooth: (v: AppContext['bluetooth']) => Promise<void>;
  setPermission: (v: AppContext['permission']) => Promise<void>;
  setFactory: (v: AppContext['factory']) => Promise<void>;
  setFcmToken: (v: AppContext['fcmToken']) => Promise<void>;
  setCurrentCompanyId: (v: AppContext['current_company_id']) => Promise<void>;
}
type TxKeyPath = import('i18next').ParseKeys | (string & Record<never, never>);

type BluetoothDevice = {
  name: string;
  address: string;
};

type Factory = 'somi' | 'veston';

type ExtendedEdge = import('react-native-safe-area-context').Edge | 'start' | 'end';

type ShiftData = {
  date: string;
  start_shift: string;
  end_shift: string;
};

type Company = {
  id: number;
  name: string;
  is_veston: boolean;
  is_shirt: boolean;
};

type Child = {
  name: string;
  id: number;
};

type ChildrenInfo = {
  name: string;
  birthday: string;
  gender: string;
};

type User = {
  name: string;
  employee_id: number;
  employee_code: string;
  old_employee_code: string;
  job_id: number;
  job_name: string;
  group_id: number;
  group_name: string;
  department_id: number;
  department_name: string;
  area_category_id: number;
  area_category_name: string;
  work_location_text: string;
  mobile_phone: string;
  work_email: string;
  onboard_time: string;
  offical_contract_date: string;
  parent: any[];
  child: Child[];
  birthday: string;
  identification_id: string;
  area_provide: string;
  date_provide: string;
  private_email: string;
  place_of_birth: string;
  address_now: string;
  bank_account_name: string;
  account_holder: string;
  bank_id: number;
  bank_name: string;
  emergency_contact: string;
  emergency_relation: string;
  marital: string;
  marital_label: string;
  count_children: number;
  children_ids: ChildrenInfo[];
  certificate_employee: string;
  study_school: string;
  study_field: string;
  image_url: string;
  emergency_phone: string;
  access_staff_transfer: boolean | undefined;
};
