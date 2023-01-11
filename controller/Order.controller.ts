import { NextApiRequest, NextApiResponse } from 'next';
import Item from '../model/Items.model';
import Order from '../model/Order.model';

export default class OrderController {
  static createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
    // creeate order

    // get customer id and cart id
    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      res.status(400).json({
        message: 'Only customer can create order',
      });
      return;
    }

    const cust_id: number = parseInt(req.session.user.id);
    const { cart_id } = req.body;

    if (cart_id == undefined || cart_id == '') {
      res.status(400).json({
        message: 'Please include cart id',
      });
      return;
    }

    if (isNaN(parseInt(cart_id as string))) {
      res.status(400).json({
        message: 'Cart id must be a number',
      });
      return;
    }

    // create order with customer id and cart id
    const order = new Order();
    order.setCartId(cart_id);
    order.setCustomerId(cust_id);
    order.setOrderStatus('pending');
    const succeed = await order.createOrder();

    if (!succeed) {
      res.status(500).json({
        message: 'Cannot create order',
      });
      return;
    }

    res.status(200).json({
      message: 'Order successfully created',
      data: {
        order_id: order.getOrderId(),
        order_status: order.getOrderStatus(),
        customer_id: order.getCustomerId(),
        cart_id: order.getCartId(),
      },
    });
  };

  static getOrders = async (req: NextApiRequest, res: NextApiResponse) => {
    const cart_id = req.query['cart-id'];

    if (cart_id == undefined) {
      await this.getAllOrders(req, res);
      return;
    }

    if (cart_id != undefined) {
      if (cart_id == '') {
        res.status(400).json({
          message: 'Please include value for cart-id',
        });
        return;
      }

      await this.getOrderByCartId(req, res);
    }
  };

  private static getAllOrders = async (req: NextApiRequest, res: NextApiResponse) => {
    // get all orders
    // check login - if customer, show their order only, if admin, show all
    if (!req.session.user) {
      res.status(400).json({
        message: 'Please login first',
      });
      return;
    }

    if (req.session.user && req.session.user.admin) {
      await this.getAllOrdersForAdmin(req, res);
      return;
    }

    await this.getAllOrdersForCustomer(req, res);
  };

  private static getAllOrdersForAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
    // for admin
  };

  private static getAllOrdersForCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
    // for customer
    // retrieve customer id
    const customer_id: number = parseInt(req.session.user?.id as string);

    // make query from order model
    let orders = await Order.getOrdersByCustomerId(customer_id);

    if (orders.length == 0) {
      res.status(200).json({
        message: 'You do not have order yet',
      });
      return;
    }

    orders = await Promise.all(
      orders.map(async (order: any) => {
        const { cart_id } = order;
        const cart_item = await Item.getAllCartItemByCartId(cart_id);
        return {
          ...order,
          cart_item: cart_item,
        };
      })
    );

    // return data query as response
    res.status(200).json({
      message: 'Successfully retrieved',
      data: orders,
    });
  };

  private static getOrderByCartId = async (req: NextApiRequest, res: NextApiResponse) => {
    // get order by cart id (for the payment, related etc)
    const cart_id = req.query['cart-id'];
  };
}
