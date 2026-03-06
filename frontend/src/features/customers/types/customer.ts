export interface Customer {
  id: number;
  title: string | null;
  lastname: string | null;
  firstname: string | null;
  postalCode: string | null;
  city: string | null;
  email: string | null;
}

export interface CustomerSummary {
  id: number;
  lastname: string | null;
}
