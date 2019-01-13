import { expect } from 'chai';
import 'mocha';
import { InvoiceItem } from './types';
import { calculateInvoiceSummary } from './invoiceCalculator';

describe('calculateInvoiceSummary function', () => {
  it('should return empty result', () => {
    const items: InvoiceItem[] = [];

    const result = calculateInvoiceSummary(items);

    expect(result.items).to.have.length(0);
    expect(result.vatRateValues).to.have.length(0);
    expect(result.summary.grossValue.toFixed()).to.be.equal('0');
    expect(result.summary.netValue.toFixed()).to.be.equal('0');
    expect(result.summary.vatValue.toFixed()).to.be.equal('0');
  });

  it('should multiply values of item by amount', () => {
    const items: InvoiceItem[] = [{ description: 'description', amount: '3', vatPercent: '10', netPrice: '10000' }];

    const result = calculateInvoiceSummary(items);

    expect(result.items).to.have.length(1);
    expect(result.vatRateValues).to.have.length(1);

    const item = result.items[0];
    expect(item.netValue.toFixed()).to.be.equal('30000');
    expect(item.vatValue.toFixed()).to.be.equal('3000');
    expect(item.grossValue.toFixed()).to.be.equal('33000');

    const vatRate = result.vatRateValues[0];
    expect(vatRate.vatRate.toFixed()).to.be.equal('10');
    expect(vatRate.netValue.toFixed()).to.be.equal('30000');
    expect(vatRate.vatValue.toFixed()).to.be.equal('3000');
    expect(vatRate.grossValue.toFixed()).to.be.equal('33000');

    const summary = result.summary;
    expect(summary.netValue.toFixed()).to.be.equal('30000');
    expect(summary.vatValue.toFixed()).to.be.equal('3000');
    expect(summary.grossValue.toFixed()).to.be.equal('33000');
  });

  it('should group values by vatPercent', () => {
    const items: InvoiceItem[] = [
      { description: 'description', amount: '1', vatPercent: '10', netPrice: '10000' },
      { description: 'description', amount: '1', vatPercent: '20', netPrice: '10000' },
      { description: 'description', amount: '1', vatPercent: '20', netPrice: '5000' },
      { description: 'description', amount: '1', vatPercent: '10', netPrice: '5000' },
    ];

    const result = calculateInvoiceSummary(items);

    const vatRate10 = result.vatRateValues.filter(item => item.vatRate.eq(10))[0];
    expect(vatRate10.vatRate.toFixed()).to.be.equal('10');
    expect(vatRate10.netValue.toFixed()).to.be.equal('15000');
    expect(vatRate10.vatValue.toFixed()).to.be.equal('1500');
    expect(vatRate10.grossValue.toFixed()).to.be.equal('16500');

    const vatRate20 = result.vatRateValues.filter(item => item.vatRate.eq(20))[0];
    expect(vatRate20.vatRate.toFixed()).to.be.equal('20');
    expect(vatRate20.netValue.toFixed()).to.be.equal('15000');
    expect(vatRate20.vatValue.toFixed()).to.be.equal('3000');
    expect(vatRate20.grossValue.toFixed()).to.be.equal('18000');
  });
});
