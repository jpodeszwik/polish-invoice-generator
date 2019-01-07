interface Institution {
  name: string;
  address: string[];
  nip: string;
}

interface Issuer extends Institution {
  account: string[];
}

interface InvoiceItem {
  description: string;
  amount: number;
  netPrice: number;
  vatPercent: number;
}

interface Invoice {
  invoiceNumber: string;
  date: string;
  place: string;
  paymentDue: string;
  issuer: Issuer;
  receiver: Institution;
  items: InvoiceItem[];
}
