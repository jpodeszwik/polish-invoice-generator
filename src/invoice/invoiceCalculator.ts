/* tslint:disable:interface-name */
import { Big } from 'big.js';
import { InvoiceItem } from './types';

const netValue = (item: InvoiceItem): Big => new Big(item.netPrice).times(item.amount);
const vatValue = (item: InvoiceItem): Big =>
  netValue(item)
    .times(item.vatPercent)
    .div(100);
const grossValue = (item: InvoiceItem): Big => netValue(item).plus(vatValue(item));

export interface InvoiceValue {
  grossValue: Big;
  netValue: Big;
  vatValue: Big;
}

interface CalculatedItem extends InvoiceValue {
  description: string;
  amount: Big;
  netPrice: Big;
  vatPercent: Big;
}

interface RateSummaryValue extends InvoiceValue {
  vatRate: Big;
}

export interface InvoiceSummary {
  items: CalculatedItem[];
  vatRateValues: RateSummaryValue[];
  summary: InvoiceValue;
}

const calculateItemValues = (item: InvoiceItem): CalculatedItem => ({
  amount: Big(item.amount),
  description: item.description,
  grossValue: grossValue(item),
  netPrice: Big(item.netPrice),
  netValue: netValue(item),
  vatPercent: Big(item.vatPercent),
  vatValue: vatValue(item),
});

const calculateSummary = (items: CalculatedItem[]): InvoiceValue => {
  return items.reduce(
    (l, r) => ({
      grossValue: l.grossValue.plus(r.grossValue),
      netValue: l.netValue.plus(r.netValue),
      vatValue: l.vatValue.plus(r.vatValue),
    }),
    { netValue: new Big(0), vatValue: new Big(0), grossValue: new Big(0) },
  );
};

const calculateVatRateSummary = (items: CalculatedItem[], vatRate: Big): RateSummaryValue => ({
  ...calculateSummary(items.filter(item => item.vatPercent.eq(vatRate))),
  vatRate,
});

export const calculateInvoiceSummary = (items: InvoiceItem[]): InvoiceSummary => {
  const valuedItems = items.map(calculateItemValues);
  const summary = calculateSummary(valuedItems);
  const distinctVatRates = [...new Set(items.map(item => item.vatPercent))];
  const vatRateValues = distinctVatRates.map(rate => calculateVatRateSummary(valuedItems, new Big(rate)));

  return {
    items: valuedItems,
    summary,
    vatRateValues,
  };
};
