import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { generateInvoice } from './invoice';
import { Invoice } from './invoice/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const invoice: Invoice = JSON.parse(event.body || '');
  const pdf = await generateInvoice(invoice);
  return {
    body: pdf,
    headers: { 'content-type': 'application/pdf' },
    isBase64Encoded: true,
    statusCode: 200,
  };
};
