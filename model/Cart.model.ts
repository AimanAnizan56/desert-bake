export default class Cart {
  private cart_id!: number;
  private cart_total!: number;
  private customer_id!: number;
  private cart_status!: string;

  setCart = (cart_id: number, cart_total: number, customer_id: number, cart_status: string) => {
    this.cart_id = cart_id;
    this.cart_total = cart_total;
    this.customer_id = customer_id;
    this.cart_status = cart_status;
  };
}
