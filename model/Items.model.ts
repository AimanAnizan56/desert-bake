import { makeQuery } from '../lib/mysql_config';

export default class Item {
  private item_id!: number;
  private product_id!: number;
  private cart_id!: number;
  private item_price!: number;
  private item_quantity!: number;

  setItem = async (product_id: number, cart_id: number) => {
    this.product_id = product_id;
    this.cart_id = cart_id;
    let row: any = await makeQuery('SELECT item_id, item_quantity FROM items WHERE product_id=? AND cart_id=?', [this.product_id, this.cart_id]);
    const temp = row;

    row = await makeQuery('SELECT product_price as item_price FROM product WHERE product_id=?', [this.product_id]);
    this.item_price = row[0].item_price;

    if (temp.length > 0) {
      this.item_id = row[0].item_id;
      this.item_quantity = row[0].item_quantity;
      return;
    }

    this.item_quantity = 0;
    row = await makeQuery('INSERT INTO items(product_id, cart_id, item_price, item_quantity) VALUES (?,?,?,?)', [this.product_id, this.cart_id, this.item_price, this.item_quantity]);
    this.item_id = row.insertId;
  };

  addToCart = async () => {
    const row: any = await makeQuery('UPDATE items SET item_quantity=item_quantity+1 WHERE item_id=?', [this.item_id]);

    if (row.affectedRows == 1) {
      return true;
    }
    return false;
  };

  output = () => {
    console.log('====================================');
    console.log('item_id: ', this.item_id);
    console.log('product_id: ', this.product_id);
    console.log('cart_id: ', this.cart_id);
    console.log('item_price: ', this.item_price);
    console.log('item_quantity: ', this.item_quantity);
    console.log('====================================');
  };
}
