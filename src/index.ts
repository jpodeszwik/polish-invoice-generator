import { Content, Table, TableLayoutFunctions, TDocumentDefinitions } from 'pdfmake/build/pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;

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

const noBorderLayout: TableLayoutFunctions = {
  hLineWidth: () => 0,
  vLineWidth: () => 0,
};

const netValue = (item: InvoiceItem) => item.netPrice * item.amount;
const vatValue = (item: InvoiceItem) => (netValue(item) * item.vatPercent) / 100;
const grossValue = (item: InvoiceItem) => netValue(item) + vatValue(item);

const summaryValues = (items: InvoiceItem[]) => {
  return items
    .map(item => ({ netValue: netValue(item), vatValue: vatValue(item), grossValue: grossValue(item) }))
    .reduce(
      (l, r) => ({
        grossValue: l.grossValue + r.grossValue,
        netValue: l.netValue + r.netValue,
        vatValue: l.vatValue + r.vatValue,
      }),
      { netValue: 0, vatValue: 0, grossValue: 0 },
    );
};

const buildItemsTable = (items: InvoiceItem[]): Table => {
  const itemRows: Content[][] = items.map((item, index) => {
    return [
      { text: `${index + 1}` },
      { text: item.description },
      { text: `${item.amount} szt` },
      { text: `${item.netPrice}` },
      { text: `${netValue(item)}` },
      { text: `${item.vatPercent}` },
      { text: `${vatValue(item)}` },
      { text: `${grossValue(item)}` },
    ];
  });

  const summary = summaryValues(items);

  const summaryRow: Content[] = [
    {},
    {},
    {},
    { text: 'Razem', bold: true },
    { text: `${summary.netValue}` },
    {},
    { text: `${summary.vatValue}` },
    { text: `${summary.grossValue}` },
  ];

  const headerRow: Content[] = [
    { text: 'LP' },
    { text: 'Nazwa towaru / usługi' },
    { text: 'Ilość' },
    { text: 'Cena netto' },
    { text: 'Wartość netto' },
    { text: 'VAT %' },
    { text: 'Wartość VAT' },
    { text: 'Wartość brutto' },
  ];

  return {
    body: [headerRow, ...itemRows, summaryRow],
    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
  };
};

const buildDocumentDefinition = (invoice: Invoice): TDocumentDefinitions => {
  const { invoiceNumber, date, place, paymentDue, issuer, receiver, items } = invoice;

  const table: Table = {
    body: [
      [{ text: 'Sprzedawca', bold: true }, { text: 'Nabywca', bold: true }],
      [{ text: issuer.name }, { text: receiver.name }],
      [{ text: issuer.address.join('\n') }, { text: receiver.address.join('\n') }],
      [{ text: `NIP ${issuer.nip}` }, { text: `NIP: ${receiver.nip}` }],
      [{ text: issuer.account.join('\n') }, {}],
    ],
    widths: ['auto', 'auto'],
  };

  return {
    content: [
      { text: [{ text: 'Faktura numer ', bold: true }, { text: invoiceNumber }] },
      { text: [{ text: 'Data wystawienia: ', bold: true }, { text: date }] },
      { text: [{ text: 'Miejsce wystawienia: ', bold: true }, { text: place }] },
      { text: [{ text: 'Termin płatności: ', bold: true }, { text: paymentDue }] },
      { text: [{ text: 'Płatność: ', bold: true }, { text: 'przelew' }] },
      { table, layout: noBorderLayout },
      { table: buildItemsTable(items) },
    ],
  };
};

export const GenerateInvoice = (invoice: Invoice): Promise<string> => {
  return new Promise<string>(resolve => {
    const documentDefinition = buildDocumentDefinition(invoice);
    const pdfFile = pdf.createPdf(documentDefinition);
    pdfFile.getBase64(resolve);
  });
};
