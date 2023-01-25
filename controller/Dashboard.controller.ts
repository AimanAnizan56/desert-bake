import { NextApiRequest, NextApiResponse } from 'next';
import Customer from '../model/Customer.model';
import Payment from '../model/Payment.model';
import Product from '../model/Product.model';

export default class DashboardController {
  static getData = async (req: NextApiRequest, res: NextApiResponse) => {
    // - top product, fewer bought product (product model)
    const top_product = await Product.getTopProduct();

    // - total product sold
    let total_product_sold = await Product.getTotalProductSold();
    total_product_sold = parseInt(total_product_sold);

    // - total product (product model too)
    const total_product = await Product.getTotalProduct();

    // - most total spend (customer model)
    const top_customer = await Customer.getMostSpendUser();

    // - total sales for the month (payment model)
    let total_sales = await Payment.getTotalSales();
    total_sales = parseFloat(total_sales).toFixed(2);

    res.status(200).json({
      top_product,
      top_customer,
      total_product,
      total_product_sold,
      total_sales,
    });
  };
}
