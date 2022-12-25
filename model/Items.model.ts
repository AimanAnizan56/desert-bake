export default class Item {
  private item_id!: number;
  private product_id!: number;
  private cart_id!: number;
  private item_price!: number;
  private item_quantity!: number;

  setItem = (item_id: number, product_id: number, cart_id: number, item_price: number, item_quantity: number) => {
    this.item_id = item_id;
    this.product_id = product_id;
    this.cart_id = cart_id;
    this.item_price = item_price;
    this.item_quantity = item_quantity;
  };
}
