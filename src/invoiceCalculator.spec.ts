import { expect } from 'chai';
import 'mocha';
import { InvoiceItem } from './invoice';
import { calculateInvoiceSummary } from './invoiceCalculator';

describe('calculateInvoiceSummary function', () => {
  it('should return empty result', () => {
    const items: InvoiceItem[] = [];

    const result = calculateInvoiceSummary(items);

    expect(result.items).to.be.empty;
    expect(result.vatRateValues).to.be.empty;
    expect(result.summary.grossValue).to.be.equal(0);
    expect(result.summary.netValue).to.be.equal(0);
    expect(result.summary.vatValue).to.be.equal(0);
  });

  it('should multiply values of item by amount', () => {
    const items: InvoiceItem[] = [{ description: 'description', amount: 3, vatPercent: 10, netPrice: 10000 }];

    const result = calculateInvoiceSummary(items);

    expect(result.items).to.have.length(1);
    expect(result.vatRateValues).to.have.length(1);

    const item = result.items[0];
    expect(item.netValue).to.be.equal(30000);
    expect(item.vatValue).to.be.equal(3000);
    expect(item.grossValue).to.be.equal(33000);

    const vatRate = result.vatRateValues[0];
    expect(vatRate.vatRate).to.be.equal(10);
    expect(vatRate.netValue).to.be.equal(30000);
    expect(vatRate.vatValue).to.be.equal(3000);
    expect(vatRate.grossValue).to.be.equal(33000);

    const summary = result.summary;
    expect(summary.netValue).to.be.equal(30000);
    expect(summary.vatValue).to.be.equal(3000);
    expect(summary.grossValue).to.be.equal(33000);
  });
});
