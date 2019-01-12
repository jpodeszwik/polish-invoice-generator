/* tslint:disable:interface-name */
import { InvoiceItem } from './types';

const netValue = (item: InvoiceItem) => item.netPrice * item.amount;
const vatValue = (item: InvoiceItem) => (netValue(item) * item.vatPercent) / 100;
const grossValue = (item: InvoiceItem) => netValue(item) + vatValue(item);

export interface InvoiceValue {
  grossValue: number;
  netValue: number;
  vatValue: number;
}

interface CalculatedItem extends InvoiceItem, InvoiceValue {}

interface RateSummaryValue extends InvoiceValue {
  vatRate: number;
}

export interface InvoiceSummary {
  items: CalculatedItem[];
  vatRateValues: RateSummaryValue[];
  summary: InvoiceValue;
}

const calculateItemValues = (item: InvoiceItem): CalculatedItem => ({
  ...item,
  grossValue: grossValue(item),
  netValue: netValue(item),
  vatValue: vatValue(item),
});

const calculateSummary = (items: CalculatedItem[]): InvoiceValue => {
  return items.reduce(
    (l, r) => ({
      grossValue: l.grossValue + r.grossValue,
      netValue: l.netValue + r.netValue,
      vatValue: l.vatValue + r.vatValue,
    }),
    { netValue: 0, vatValue: 0, grossValue: 0 },
  );
};

const calculateVatRateSummary = (items: CalculatedItem[], vatRate: number): RateSummaryValue => ({
  ...calculateSummary(items.filter(item => item.vatPercent === vatRate)),
  vatRate,
});

export const calculateInvoiceSummary = (items: InvoiceItem[]): InvoiceSummary => {
  const valuedItems = items.map(calculateItemValues);
  const summary = calculateSummary(valuedItems);
  const distinctVatRates = [...new Set(items.map(item => item.vatPercent))];
  const vatRateValues = distinctVatRates.map(rate => calculateVatRateSummary(valuedItems, rate));

  return {
    items: valuedItems,
    summary,
    vatRateValues,
  };
};
