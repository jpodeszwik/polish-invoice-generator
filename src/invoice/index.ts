import { Content, Table, TableCell, TableLayoutFunctions, TDocumentDefinitions } from 'pdfmake/build/pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { calculateInvoiceSummary } from './invoiceCalculator';
import { Invoice, InvoiceItem } from './types';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;

const noBorderLayout: TableLayoutFunctions = {
  hLineWidth: () => 0,
  vLineWidth: () => 0,
};

const emptyCell: TableCell = { text: '', border: [false, false, false, false] };

const buildItemsTable = (items: InvoiceItem[]): Table => {
  const invoiceSummary = calculateInvoiceSummary(items);

  const itemRows: TableCell[][] = invoiceSummary.items.map((item, index) => {
    return [
      { text: `${index + 1}` },
      { text: item.description },
      { text: `${item.amount} szt` },
      { text: `${item.netPrice}` },
      { text: `${item.netValue}` },
      { text: `${item.vatPercent}` },
      { text: `${item.vatValue}` },
      { text: `${item.grossValue}` },
    ];
  });

  const summaryPerRateRows: TableCell[][] = invoiceSummary.vatRateValues.map((summary, index) => {
    return [
      emptyCell,
      emptyCell,
      emptyCell,
      index === 0 ? { text: 'W tym' } : emptyCell,
      { text: `${summary.netValue}` },
      { text: `${summary.vatRate}` },
      { text: `${summary.vatValue}` },
      { text: `${summary.grossValue}` },
    ];
  });

  const totalSummary = invoiceSummary.summary;

  const summaryRow: TableCell[] = [
    emptyCell,
    emptyCell,
    emptyCell,
    { text: 'Razem', bold: true },
    { text: `${totalSummary.netValue}` },
    {},
    { text: `${totalSummary.vatValue}` },
    { text: `${totalSummary.grossValue}` },
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
    body: [headerRow, ...itemRows, ...summaryPerRateRows, summaryRow],
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

export const generateInvoice = (invoice: Invoice): Promise<string> =>
  new Promise<string>(resolve => {
    const documentDefinition = buildDocumentDefinition(invoice);
    const pdfFile = pdf.createPdf(documentDefinition);
    pdfFile.getBase64(resolve);
  });