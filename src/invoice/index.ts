import { Big, RoundingMode } from 'big.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Content, Table, TableCell, TableLayoutFunctions, TDocumentDefinitions } from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { calculateInvoiceSummary, InvoiceSummary, InvoiceValue } from './invoiceCalculator';
import { Invoice } from './types';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;

const noBorderLayout: TableLayoutFunctions = {
  hLineWidth: () => 0,
  vLineWidth: () => 0,
};

const emptyCell: TableCell = { text: '', border: [false, false, false, false] };

const formatCurrency = (amount: Big) => amount.round(2, RoundingMode.RoundHalfUp).toFixed(2);

const horizontalSpacer = (): Content => {
  return {
    canvas: [
      {
        lineColor: '#808080',
        lineWidth: 1,
        type: 'line',
        x1: 0,
        x2: 515,
        y1: 4,
        y2: 4,
      },
      {
        lineColor: '#cccccc',
        lineWidth: 1,
        type: 'line',
        x1: 0,
        x2: 515,
        y1: 5,
        y2: 5,
      },
      {
        lineColor: '#ffffff',
        lineWidth: 1,
        type: 'line',
        x1: 0,
        x2: 515,
        y1: 9,
        y2: 9,
      },
    ],
  };
};

const buildItemsTable = (invoiceSummary: InvoiceSummary): Table => {
  const itemRows: TableCell[][] = invoiceSummary.items.map((item, index) => {
    return [
      { text: `${index + 1}`, alignment: 'right' },
      { text: item.description },
      { text: `${item.amount} szt`, alignment: 'right' },
      { text: formatCurrency(item.netPrice), alignment: 'right' },
      { text: formatCurrency(item.netValue), alignment: 'right' },
      { text: `${item.vatPercent}`, alignment: 'right' },
      { text: formatCurrency(item.vatValue), alignment: 'right' },
      { text: formatCurrency(item.grossValue), alignment: 'right' },
    ];
  });

  const summaryPerRateRows: TableCell[][] = invoiceSummary.vatRateValues.map((summary, index) => {
    return [
      emptyCell,
      emptyCell,
      emptyCell,
      index === 0 ? { text: 'W tym', alignment: 'right' } : emptyCell,
      { text: formatCurrency(summary.netValue), alignment: 'right' },
      { text: `${summary.vatRate}`, alignment: 'right' },
      { text: formatCurrency(summary.vatValue), alignment: 'right' },
      { text: formatCurrency(summary.grossValue), alignment: 'right' },
    ];
  });

  const totalSummary = invoiceSummary.summary;

  const summaryRow: TableCell[] = [
    emptyCell,
    emptyCell,
    emptyCell,
    { text: 'Razem', bold: true, alignment: 'right' },
    { text: formatCurrency(totalSummary.netValue), alignment: 'right' },
    {},
    { text: formatCurrency(totalSummary.vatValue), alignment: 'right' },
    { text: formatCurrency(totalSummary.grossValue), alignment: 'right' },
  ];

  const headerRow: Content[] = [
    { text: 'LP', alignment: 'right' },
    { text: 'Nazwa towaru / usługi', alignment: 'left' },
    { text: 'Ilość', alignment: 'right' },
    { text: 'Cena netto', alignment: 'right' },
    { text: 'Wartość netto', alignment: 'right' },
    { text: 'VAT %', alignment: 'right' },
    { text: 'Wartość VAT', alignment: 'right' },
    { text: 'Wartość brutto', alignment: 'right' },
  ];

  return {
    body: [headerRow, ...itemRows, ...summaryPerRateRows, summaryRow],
    widths: ['3%', '39%', '5%', '12%', '12%', '5%', '12%', '12%'],
  };
};

const buildSummaryTable = (invoiceSummary: InvoiceValue): Content => {
  const body: TableCell[][] = [
    [{ text: 'Wartość netto', bold: true }, { text: formatCurrency(invoiceSummary.netValue) }],
    [{ text: 'Wartość VAT', bold: true }, { text: formatCurrency(invoiceSummary.vatValue) }],
    [{ text: 'Wartość brutto', bold: true }, { text: formatCurrency(invoiceSummary.grossValue) }],
  ];

  return {
    body,
    widths: ['auto', 'auto'],
  };
};

const buildDocumentDefinition = (invoice: Invoice): TDocumentDefinitions => {
  const { invoiceNumber, date, place, paymentDue, issuer, receiver, items } = invoice;
  const invoiceSummary = calculateInvoiceSummary(items);

  const table: Table = {
    body: [
      [{ text: 'Sprzedawca', bold: true }, { text: 'Nabywca', bold: true }],
      [{ text: issuer.name }, { text: receiver.name }],
      [{ text: issuer.address.join('\n') }, { text: receiver.address.join('\n') }],
      [{ text: `NIP ${issuer.nip}` }, { text: `NIP: ${receiver.nip}` }],
      [{ text: issuer.account.join('\n') }, {}],
    ],
    widths: ['50%', '50%'],
  };

  return {
    content: [
      { text: [{ text: 'Faktura numer ', bold: true }, { text: invoiceNumber }] },
      { text: [{ text: 'Data wystawienia: ', bold: true }, { text: date }] },
      { text: [{ text: 'Miejsce wystawienia: ', bold: true }, { text: place }] },
      { text: [{ text: 'Termin płatności: ', bold: true }, { text: paymentDue }] },
      { text: [{ text: 'Płatność: ', bold: true }, { text: 'przelew' }] },
      horizontalSpacer(),
      { table, layout: noBorderLayout },
      { table: buildItemsTable(invoiceSummary) },
      { table: buildSummaryTable(invoiceSummary.summary), layout: noBorderLayout },
      horizontalSpacer(),
      { text: [{ text: 'Do zapłaty ', bold: true }, { text: formatCurrency(invoiceSummary.summary.grossValue) }] },
      horizontalSpacer(),
      { text: 'Imię i nazwisko wystawcy:', bold: true },
      { text: `${invoice.createdBy}` },
    ],
    defaultStyle: {
      fontSize: 8,
    },
  };
};

export const generateInvoice = (invoice: Invoice): Promise<string> =>
  new Promise<string>(resolve => {
    const documentDefinition = buildDocumentDefinition(invoice);
    const pdfFile = pdf.createPdf(documentDefinition);
    pdfFile.getBase64(resolve);
  });
