export interface Company {
  company_id: number;
  company_name: string;
  banners: Banner[];
}

export interface Banner {
  id: number;
  name: string;
  mimetype: string;
  url: string;
  image_url: string;
}
