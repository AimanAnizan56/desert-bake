import { NextApiRequest, NextApiResponse } from 'next';
import Customer from '../model/Customer.model';
import Payment from '../model/Payment.model';
import Product from '../model/Product.model';

export default class SalesController {
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

// MOST CUSTOMER SPEND
// SELECT customer.customer_id, customer_name, SUM(cart_total)
// FROM customer, cart, orders
// WHERE customer.customer_id=cart.customer_id AND
// orders.customer_id = customer.customer_id AND
// orders.cart_id=cart.cart_id AND
// (orders.order_status='complete' OR orders.order_status='preparing' OR orders.order_status='ready_for_pickup')
// GROUP BY customer.customer_id
