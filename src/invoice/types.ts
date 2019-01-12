export interface Institution {
  name: string;
  address: string[];
  nip: string;
}

export interface Issuer extends Institution {
  account: string[];
}

export interface InvoiceItem {
  description: string;
  amount: number;
  netPrice: number;
  vatPercent: number;
}

export interface Invoice {
  invoiceNumber: string;
  date: string;
  place: string;
  paymentDue: string;
  issuer: Issuer;
  receiver: Institution;
  items: InvoiceItem[];
  createdBy: string;
}
