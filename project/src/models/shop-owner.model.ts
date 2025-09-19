export interface ShopOwner {
  id?: number;
  ownerName: string;
  email: string;
  shopName: string;
  location: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}