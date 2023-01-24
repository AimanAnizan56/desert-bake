import axios from 'axios';
import Customer from '../model/Customer.model';
import fs from 'fs';
import path from 'path';
import Product from '../model/Product.model';
import { emailTemplate } from './email-template';

export const emailAnnounceProduct = async (product: Product) => {
  const index = __dirname.split('\\').findIndex((elem) => elem == 'dessert-bake');
  const tempPath = __dirname.split('\\');

  let realpath = tempPath[0];
  for (let i = 1; i < index; i++) {
    realpath = path.join(realpath, tempPath[i]);
  }
  realpath = path.join(realpath, 'dessert-bake', 'public', (await product.getImagePath())?.imagePath as string);
  const productImage = fs.readFileSync(realpath, { encoding: 'base64' });

  if ((await Customer.getAllCustomerData()).length == 0) {
    console.log('====================================');
    console.log('No customer has register yet');
    console.log('====================================');
    return {
      message: 'No customer has register yet',
      success: false,
    };
  }

  const allCustomer = (await Customer.getAllCustomerData()).map((cust: any) => ({
    email: cust.customer_email,
    name: cust.customer_name,
  }));

  const html = emailTemplate(product);

  const options = {
    method: 'POST',
    url: `https://sandbox.api.mailtrap.io/api/send/${process.env.MAILTRAP_INBOX_ID}`,
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': process.env.MAILTRAP_API_TOKEN,
    },
    data: {
      to: allCustomer,
      from: { email: 'no-reply@dessertbake.com', name: 'Dessert Bake' },
      subject: 'Product Announcement',
      text: 'This is product announcement test',
      attachments: [
        {
          filename: 'yR-E8ZV2aIKu-9-VnlbpWnGP.jpg',
          content_id: 'product.jpg',
          disposition: 'inline',
          content: productImage,
        },
      ],
      html: html,
    },
  };

  try {
    const mailtrap_response = await axios.request(options);
    const { success, message_ids } = mailtrap_response.data;
    if (success) {
      console.log('Mailtrap Response', {
        success: success,
        message_ids: message_ids,
      });
      return {
        message: 'No customer has register yet',
        success: false,
      };
    }
  } catch (err: any) {
    console.log(err.response.data);
    return {
      message: 'Error: cannot send mail',
      error: err.response.data,
      success: false,
    };
  }
};
