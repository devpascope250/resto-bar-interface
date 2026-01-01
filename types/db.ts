// ================== ENUM TYPES ==================
enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK'
}

enum BeverageCategoryType {
  ALCOHOLIC = 'ALCOHOLIC',
  NON_ALCOHOLIC = "NON_ALCOHOLIC"
}

enum ProductType {
  BEVERAGE = 'BEVERAGE',
  FOOD = 'FOOD',
  OTHER = 'OTHER'
}

enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum orderItemStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

type OrderStatusType = keyof typeof OrderStatus;

enum BeverageType {
  COLD = 'COLD',
  HOT = 'HOT',
  NORMAL = "NORMAL",
  ROOM_TEMPERATURE = 'ROOM_TEMPERATURE',
  FROZEN = 'FROZEN'
}

enum BeverageSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  XL = 'XL'
}

interface BeverageCategory {
  id: number;
  name: string;
  description: string;
  type: BeverageCategoryType;
  createdAt: Date;
  updatedAt: Date;
}

// ================== MODEL TYPES ==================
interface Product {
  id: number;
  itemCd: string;
  itemClCd?: string;
  itemTyCd?: string;
  taxTyCd?: string;
  partnerId: string;
  productType: ProductType;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  currentStock: number;
  lowStockThreshold: number;
  beverageType: BeverageType | null;
  beverageSize: BeverageSize | null;
  temperature: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  stockIns?: StockIn[];
  stockOuts?: StockOut[];
  stockHistory?: StockHistory[];
  beverageCategory?: BeverageCategory;
  discount?: Discount;
}

interface Discount {
  id: string
  discountName: string
  rate: number
  productId: string
  productName?: string
  startDate: Date | string
  endDate: Date | string
  createdAt: Date | string
  isActive?: boolean
}

interface StockIn {
  id: number;
  productId: number;
  userId: string;
  quantity: number | null;
  dozens: number | null;
  price: number;
  reason: string | null;
  totalPrice: number;
  sellingPrice: number;
  expiredDate: Date | null;
  status: StockStatus;
  createdAt: Date;
  product?: Product;
  stockOuts?: StockOut[];
  orderItems?: OrderItems[];
}

interface StockOut {
  id: number;
  productId: number;
  stockInId: number;
  userId: string;
  quantity: number | null;
  dozens: number | null;
  reason: string | null;
  sellingPrice: number;
  tax: number;
  totalPrice: number;
  createdAt: Date;
  product?: Product;
  stockIn?: StockIn;
}

interface Orders {
  id: number;
  orderName: string;
  userId: string;
  quantity: number | null;
  dozens: number | null;
  sellingPrice: number;
  tax: number;
  totalPrice: number;
  status: OrderStatus;
  orderedAt: Date;
  confirmedBy: string | null;
  confirmedAt: Date | null;
  orderItems?: OrderItems[];
}

interface OrderItems {
  id: number;
  orderId: number;
  stockInId: number;
  quantity: number | null;
  dozens: number | null;
  sellingPrice: number;
  totalPrice: number;
  addedAt: Date;
  order?: Orders;
  stockIn?: StockIn;
  product?: Product;
}

interface StockHistory {
  id: number;
  productId: number;
  date: Date;
  openingStock: number;
  closingStock: number;
  stockIn: number;
  stockOut: number;
  product?: Product;
}

// ================== CREATE INPUT TYPES ==================
interface CreateProductInput {
  partnerId: string;
  productType: ProductType;
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  currentStock?: number;
  lowStockThreshold?: number;
  beverageType?: BeverageType | null;
  beverageSize?: BeverageSize | null;
  isAlcoholic?: boolean | null;
  temperature?: string | null;
}

interface CreateStockInInput {
  productId: number;
  userId: string;
  quantity?: number | null;
  dozens?: number | null;
  price?: number;
  reason?: string | null;
  totalPrice?: number;
  sellingPrice?: number;
  expiredDate?: Date | null;
  status: StockStatus;
}

interface CreateStockOutInput {
  productId: number;
  stockInId: number;
  userId: string;
  quantity?: number | null;
  dozens?: number | null;
  reason?: string | null;
  sellingPrice?: number;
  tax?: number;
  totalPrice?: number;
}

interface CreateOrderInput {
  orderName: string;
  userId: string;
  quantity?: number | null;
  dozens?: number | null;
  sellingPrice?: number;
  tax?: number;
  totalPrice?: number;
  status?: OrderStatus;
  confirmedBy?: string | null;
}

interface CreateOrderItemInput {
  orderId: number;
  stockInId: number;
  quantity?: number | null;
  dozens?: number | null;
  sellingPrice?: number;
  totalPrice?: number;
}

interface CreateStockHistoryInput {
  productId: number;
  date?: Date;
  openingStock: number;
  closingStock: number;
  stockIn: number;
  stockOut: number;
}

// ================== UPDATE INPUT TYPES ==================
interface UpdateProductInput {
  partnerId?: string;
  productType?: ProductType;
  name?: string;
  description?: string | null;
  image?: string | null;
  price?: number;
  currentStock?: number;
  lowStockThreshold?: number;
  beverageType?: BeverageType | null;
  beverageSize?: BeverageSize | null;
  isAlcoholic?: boolean | null;
  temperature?: string | null;
}

interface UpdateStockInInput {
  quantity?: number | null;
  dozens?: number | null;
  price?: number;
  reason?: string | null;
  totalPrice?: number;
  sellingPrice?: number;
  expiredDate?: Date | null;
  status?: StockStatus;
}

interface UpdateStockOutInput {
  quantity?: number | null;
  dozens?: number | null;
  reason?: string | null;
  sellingPrice?: number;
  tax?: number;
  totalPrice?: number;
}

interface UpdateOrderInput {
  orderName?: string;
  quantity?: number | null;
  dozens?: number | null;
  sellingPrice?: number;
  tax?: number;
  totalPrice?: number;
  status?: OrderStatus;
  confirmedBy?: string | null;
  confirmedAt?: Date | null;
}

// ================== FILTER TYPES ==================
interface ProductFilter {
  partnerId?: string;
  productType?: ProductType;
  name?: string;
  beverageType?: BeverageType;
  beverageSize?: BeverageSize;
  isAlcoholic?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
}

interface StockFilter {
  productId?: number;
  status?: StockStatus;
  startDate?: Date;
  endDate?: Date;
}

interface OrderFilter {
  userId?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
}

// ================== BEVERAGE SPECIFIC TYPES ==================
interface BeverageProduct extends Product {
  productType: ProductType.BEVERAGE;
  beverageType: BeverageType;
  beverageSize: BeverageSize;
  isAlcoholic: boolean;
}

interface ColdBeverageFilter {
  beverageType: BeverageType.COLD;
  beverageSize?: BeverageSize;
  isAlcoholic?: boolean;
}

interface HotBeverageFilter {
  beverageType: BeverageType.HOT;
  beverageSize?: BeverageSize;
  isAlcoholic?: boolean;
}

// ================== RESPONSE TYPES ==================
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ================== STOCK MANAGEMENT TYPES ==================
interface StockLevel {
  productId: number;
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
  status: StockStatus;
}

interface StockAlert {
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK';
}

interface MonthlyRemport {
  id: number;
  productId: number;
  productType: ProductType;
  currentStock: number;
  name: string;
  totalIn: number;
  totalOut: number;
  openingStock: number;
  closingStock: number;
  date: Date;
  soldAmount: number;
  totalAmount: number;
}

interface CartItem {
  id: number;
  product: Product
  quantity: number
  status: "CONFIRMED" | "PENDING" | "CANCELLED"
  beverageCondition?: BeverageCondition
}

type BeverageCondition = "HOT" | "NORMAL" | "COLD" | "FROZEN" | "ROOM_TEMPERATURE"

interface DisplayOrder {
  id: number;
  name: string;
  status: OrderStatus;
  createdAt: Date;
  distributor: string;
  totalPrice: number;
  invoices?: Invoices[]
}

interface Invoices {
  id: string;
  invcNo: number;
  orderId: number;
}



interface OrderDetails {
  id: number;
  orderName: string;
  createdAt: string;
  orderCustomers: Array<{
    id: number;
    name: string;
    tin?: string;
    mobile?: string;
    paymentType: string;
  }>;
  orderItems: Array<{
    id: number;
    productId: number;
    quantity: number;
    beverageType: string;
    status: orderItemStatus;
    product: {
      id: number;
      itemCd: string;
      beverageSize: string;
      beverageCategoryName: string;
      beverageCategoryType: string;
      name: string;
      price: number;
      currentStock: number;
      description: string;
      image: string;
      discount?: Discount
    };
  }>;
  distributor?: string;
  status?: string;
  totals?: {
    subtotal: number;
    tax: number;
    total: number;
  };
}

