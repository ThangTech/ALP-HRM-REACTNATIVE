type WarehouseType = 'input' | 'output' | 'transfer';

interface InputWarehouseItem {
  id: string;
  name: string;
  category: string;
  materialCode: string;
  materialColor: string;
  quantity: number;
  unit: string;
  date: string;
  status: 'draft' | 'progress' | 'done';
}

interface WarehouseListItem {
  id: number;
  name: string;
  quantity: number;
  location_ids: WarehouseLocationDetail[];
  move_ids: move_idsType[];
  company: string;
  state: 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancel';
  date: string;
  invoice_number: string[];
}

interface WarehouseLocationDetail {
  id: number;
  name: string;
  products: string;
  request_quantity: number;
  done_quantity: number;
}

interface move_idsType {
  id: number;
  product_category: string;
  product_code: string;
  product_color: string;
  request_quantity: number;
  done_quantity: number;
  location_source: number;
  location_dest: number;
  location_source_id: number;
  location_dest_id: number;
}

interface WarehouseDetailResponse {
  id: number;
  name: string;
  company: string;
  invoice_number: string[];
  state: 'draft' | 'waiting' | 'confirmed' | 'assigned' | 'done' | 'cancel';
  quantity: number;
}

interface RollItem {
  id: number;
  name: string;
  product_color: string | boolean;
  request_quantity: number;
  done_quantity: number;
}

interface RollItemLine {
  id: number;
  package_id: boolean;
  package: boolean;
  request_quantity: number;
  done_quantity: number;
  location_source: string;
  location_dest: string;
}

interface RollMoveList {
  id: number;
  product_category: string;
  product_color: string;
  product_code: string;
  product_id: number;
  company_id: number;
  company: string;
  request_quantity: number;
  done_quantity: number;
  location_source: string;
  location_dest: string;
  line_ids: RollItemLine[];
}
