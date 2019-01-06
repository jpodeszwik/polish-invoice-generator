import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const content: pdfMake.Content = {
  text: 'Hello world',
};

const dd: pdfMake.TDocumentDefinitions = {
  content,
};

export const Hello = (): Promise<string> => {
  return new Promise<string>(resolve => {
    const pdf = pdfMake;
    pdf.vfs = pdfFonts.pdfMake.vfs;

    const pdfFile = pdf.createPdf(dd);
    pdfFile.getBase64(resolve);
  });
};
