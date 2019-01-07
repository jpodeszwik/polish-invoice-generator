process.chdir('dist');
const index = require('./dist/index');
const fs = require('fs');

const processResult = result => {
  const buffer = Buffer.from(result, 'base64');
  fs.writeFile('../invoice.pdf', buffer, err => {
    if (err === null) {
      console.log('finished writing invoice.pdf file');
    } else {
      console.error(`error occured during writing file ${error}`);
    }
  });
};

const invoiceData = {
  date: '2019-01-31',
  invoiceNumber: '1/2019',
  issuer: {
    account: ['bankName', '12 3456 7890 1234 5678 9012 3456'],
    address: ['Street 1/1', '00-000 Warszawa, Polska'],
    name: 'Issuer Name',
    nip: '1234567890',
  },
  paymentDue: '2019-02-14',
  place: 'Gdańsk',
  receiver: {
    address: ['Street 1/2', '00-000 Warszawa, Polska'],
    name: 'Receiver name',
    nip: '0987654321',
  },
  items: [
    {
      description: 'Nazwa usługi',
      amount: 1,
      netPrice: 1650,
      vatPercent: 23,
    },
    {
      description: 'Nazwa usługi2',
      amount: 2,
      netPrice: 850,
      vatPercent: 23,
    },
  ],
};

index.GenerateInvoice(invoiceData).then(processResult);
