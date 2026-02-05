
export type UserRole = 'ADMIN' | 'SALESMAN';
export type UserStatus = 'PENDING' | 'APPROVED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  uom?: string; // Unit of Measure
}

export interface SalesmanStock {
  salesmanId: string;
  productId: string;
  productName: string;
  sku: string;
  uom?: string;
  stock: number;
  assignedPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  trn?: string; // Tax Registration Number
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number; // In PCS
  quantityCtn: number; // In CTN
  priceCtn: number;
  grossAmount: number;
  exciseDuty: number;
  discountPercent: number;
  discountVal: number;
  vatPercent: number;
  vatAmount: number;
  totalIncl: number;
  uom?: string;
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  cost: number;
  total: number;
  date: string;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  customerTrn?: string;
  items: SaleItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  date: string;
  orderDate: string;
  deliveryDate: string;
  salesMan: string;
  vehicleNo?: string;
  poNo?: string;
  poDate?: string;
  dmId?: string;
  supplierRef?: string;
  paymentType: string;
  emirates?: string;
  siteCode?: string;
  custCode?: string;
  currency?: string;
  mobile?: string;
}

export interface AppSettings {
  companyName: string;
  companyNameArabic: string;
  logoUrl: string;
  vatNumber: string;
  exciseTrn?: string;
  address: string;
  phone: string;
  email: string;
  vatPercent: number;
  warehouseDetails?: string;
}
