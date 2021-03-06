/*
based on @types/pdfmake, but with extra method getBase64 for TCreatedPdf
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pdfmake/index.d.ts
https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31011
 */

declare module 'pdfmake/build/vfs_fonts' {
  let pdfMake: {
    vfs: any;
    [name: string]: any;
  };
}

declare module 'pdfmake/build/pdfmake' {
  let vfs: TFontFamily;
  let fonts: { [name: string]: TFontFamilyTypes };

  function createPdf(documentDefinitions: TDocumentDefinitions): TCreatedPdf;

  enum PageSize {
    A0_x_4 = '4A0',
    A0_x_2 = '2A0',
    AO = 'A0',
    A1 = 'A1',
    A2 = 'A2',
    A3 = 'A3',
    A4 = 'A4',
    A5 = 'A5',
    A6 = 'A6',
    A7 = 'A7',
    A8 = 'A8',
    A9 = 'A9',
    A1O = 'A10',
    BO = 'B0',
    B1 = 'B1',
    B2 = 'B2',
    B3 = 'B3',
    B4 = 'B4',
    B5 = 'B5',
    B6 = 'B6',
    B7 = 'B7',
    B8 = 'B8',
    B9 = 'B9',
    B1O = 'B10',
    CO = 'C0',
    C1 = 'C1',
    C2 = 'C2',
    C3 = 'C3',
    C4 = 'C4',
    C5 = 'C5',
    C6 = 'C6',
    C7 = 'C7',
    C8 = 'C8',
    C9 = 'C9',
    C1O = 'C10',
    RA1 = 'RA1',
    RA2 = 'RA2',
    RA3 = 'RA3',
    RA4 = 'RA4',
    SRA1 = 'SRA1',
    SRA2 = 'SRA2',
    SRA3 = 'SRA3',
    SRA4 = 'SRA4',
    EXECUTIVE = 'EXECUTIVE',
    FOLIO = 'FOLIO',
    LEGAL = 'LEGAL',
    LETTER = 'LETTER',
    TABLOID = 'TABLOID',
  }

  enum PageOrientation {
    PORTRAIT = 'PORTRAIT',
    LANDSCAPE = 'LANDSCAPE',
  }

  let pdfMake: pdfMakeStatic;

  interface TFontFamily {
    [fontName: string]: string;
  }

  interface TFontFamilyTypes {
    normal?: string;
    bold?: string;
    italics?: string;
    bolditalics?: string;
  }

  interface TDocumentInformation {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  }

  type TDocumentHeaderFooterFunction = (currentPage: number, pageCount: number) => any;

  type Margins = number | [number, number] | [number, number, number, number];

  type Alignment = 'left' | 'right' | 'justify' | 'center' | string;

  interface Style {
    font?: any;
    fontSize?: number;
    fontFeatures?: any;
    bold?: boolean;
    italics?: boolean;
    alignment?: Alignment;
    color?: string;
    columnGap?: any;
    fillColor?: string;
    decoration?: any;
    decorationany?: any;
    decorationColor?: string;
    background?: any;
    lineHeight?: number;
    characterSpacing?: number;
    noWrap?: boolean;
    markerColor?: string;
    leadingIndent?: any;

    [additionalProperty: string]: any;
  }

  interface CanvasElement {
    type: string;
    x?: number;
    y?: number;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
    w?: number;
    h?: number;
    r?: number;
    lineColor?: string;
    color?: string;
    lineWidth?: number;
    closePath?: boolean;
  }

  type TableRowFunction = (row: number) => number;

  interface TableLayoutFunctions {
    hLineWidth?: (i: number, node: any) => number;
    vLineWidth?: (i: number, node: any) => number;
    hLineColor?: (i: number, node: any) => string;
    vLineColor?: (i: number, node: any) => string;
    fillColor?: (i: number, node: any) => string;
    paddingLeft?: (i: number, node: any) => number;
    paddingRight?: (i: number, node: any) => number;
    paddingTop?: (i: number, node: any) => number;
    paddingBottom?: (i: number, node: any) => number;
  }

  interface TableCell {
    text?: string;
    rowSpan?: number;
    colSpan?: number;
    fillColor?: string;
    bold?: boolean;
    border?: [boolean, boolean, boolean, boolean];
    alignment?: Alignment;
  }

  interface Table {
    widths?: Array<string | number>;
    heights?: Array<string | number> | TableRowFunction;
    headerRows?: number;
    body: Content[][] | TableCell[][];
    layout?: string | TableLayoutFunctions;
  }

  interface Content {
    style?: 'string';
    margin?: Margins;
    text?: string | string[] | Content[];
    columns?: Content[];
    stack?: Content[];
    image?: string;
    width?: string | number;
    height?: string | number;
    fit?: [number, number];
    pageBreak?: 'before' | 'after';
    alignment?: Alignment;
    table?: Table;
    ul?: Content[];
    ol?: Content[];
    bold?: boolean;
    layout?: TableLayoutFunctions;
    canvas?: CanvasElement[];

    [additionalProperty: string]: any;
  }

  interface TDocumentDefinitions {
    info?: TDocumentInformation;
    compress?: boolean;
    header?: TDocumentHeaderFooterFunction;
    footer?: TDocumentHeaderFooterFunction;
    content: string | Content | Content[];
    styles?: Style;
    pageSize?: PageSize;
    pageOrientation?: PageOrientation;
    pageMargins?: Margins;
    defaultStyle?: Style;
  }

  type CreatedPdfParams = (defaultFileName?: string, cb?: string, options?: string) => void;

  interface TCreatedPdf {
    download: CreatedPdfParams;
    open: CreatedPdfParams;
    print: CreatedPdfParams;
    getBase64: GetBase64Params;
  }

  type GetBase64Function = (cb?: string, options?: string) => void;

  type GetBase64Params = (options?: GetBase64Function) => void;

  interface pdfMakeStatic {
    vfs: TFontFamily;
    fonts: { [name: string]: TFontFamilyTypes };

    createPdf(documentDefinitions: TDocumentDefinitions): TCreatedPdf;
  }
}
