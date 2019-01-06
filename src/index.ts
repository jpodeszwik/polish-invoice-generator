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

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  place: string;
  paymentDue: string;
  issuer: Issuer;
  receiver: Institution;
}

const noBorderLayout: pdfMake.TableLayoutFunctions = {
  hLineWidth: () => 0,
  vLineWidth: () => 0,
};

const buildDocumentDefinition = (invoiceData: InvoiceData): pdfMake.TDocumentDefinitions => {
  const { invoiceNumber, date, place, paymentDue, issuer, receiver } = invoiceData;

  const table: pdfMake.Table = {
    body: [
      [{ text: 'Sprzedawca', bold: true }, { text: 'Nabywca', bold: true }],
      [{ text: issuer.name }, { text: receiver.name }],
      [{ text: issuer.address.join('\n') }, { text: receiver.address.join('\n') }],
      [{ text: `NIP ${issuer.nip}` }, { text: `NIP: ${receiver.nip}` }],
      [{ text: issuer.account }, {}],
    ],
    widths: [250, 250],
  };

  return {
    content: [
      { text: [{ text: 'Faktura numer ', bold: true }, { text: invoiceNumber }] },
      { text: [{ text: 'Data wystawienia: ', bold: true }, { text: date }] },
      { text: [{ text: 'Miejsce wystawienia: ', bold: true }, { text: place }] },
      { text: [{ text: 'Termin płatności: ', bold: true }, { text: paymentDue }] },
      { text: [{ text: 'Płatność: ', bold: true }, { text: 'przelew' }] },
      { table, layout: noBorderLayout },
    ],
  };
};

export const Hello = (invoiceData: InvoiceData): Promise<string> => {
  return new Promise<string>(resolve => {
    const documentDefinition = buildDocumentDefinition(invoiceData);
    const pdfFile = pdf.createPdf(documentDefinition);
    pdfFile.getBase64(resolve);
  });
};
