import { makeQuery } from '../lib/mysql_config';

export default class Product {
  private id!: number;
  private name: string;
  private price: number;
  private description: string;
  private type: string;
  private imagePath!: string;

  constructor(name: string, price: number, description: string, type: string) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.type = type;
  }

  setId = (id: number) => {
    this.id = id;
  };

  setImage = (image: any) => {
    this.imagePath = (image.path as string).replaceAll('\\', '/').replace('public', '');
  };

  createProduct = async () => {
    const row = makeQuery('INSERT INTO product (product_name, product_price, product_type, product_description, product_image_path) VALUES (?,?,?,?,?)', [this.name, this.price, this.type, this.description, this.imagePath]);
    const data = await row;

    if (data.affectedRows == 1) {
      return {
        id: data.insertId,
        name: this.name,
        price: this.price,
        type: this.type,
        description: this.description,
        imagePath: this.imagePath,
      };
    }

    return {
      error: 'Could not insert product',
    };
  };

  static getProducts = async () => {
    const data: any = await makeQuery('SELECT * FROM product WHERE status="active"');

    return data;
  };

  static getProduct = async (id: number) => {
    const data = await makeQuery('SELECT * FROM product WHERE product_id=? AND status="active"', [id]);

    return data;
  };

  getImagePath = async () => {
    const row: any = await makeQuery('SELECT product_image_path FROM product WHERE product_id=?', [this.id]);

    if (row) {
      return {
        imagePath: row[0].product_image_path,
      };
    }
  };

  updateProduct = async () => {
    const row: any = await makeQuery('UPDATE product SET product_name=?, product_price=?, product_description=?, product_type=? WHERE product_id=?', [this.name, this.price, this.description, this.type, this.id]);

    if (row.affectedRows == 1) {
      return {
        id: this.id,
        name: this.name,
        price: this.price,
        description: this.description,
        type: this.type,
      };
    }

    return {
      error: 'Could not update product',
    };
  };

  updateProductImage = async () => {
    const row: any = await makeQuery('UPDATE product SET product_image_path=? WHERE product_id=?', [this.imagePath, this.id]);

    if (row.affectedRows == 1) {
      return {
        id: this.id,
        name: this.name,
        price: this.price,
        description: this.description,
        type: this.type,
        image: this.imagePath,
      };
    }

    return {
      error: 'Could not update product image',
    };
  };

  static deleteProduct = async (id: number) => {
    const row: any = await makeQuery('UPDATE product SET status = "inactive" WHERE product_id=?', [id]);

    console.log('====================================');
    console.log('Row', row);
    console.log('====================================');

    if (row.affectedRows == 1) {
      return true;
    }
    return false;
  };

  //
  // FOR SALES
  //
  static getTopProduct = async () => {
    //     SELECT product.product_id, product_name ,
    // count(product.product_id) AS total_sold
    // FROM items, product
    // WHERE product.product_id=items.product_id
    // group by product.product_id
    const row: any = await makeQuery('SELECT product.product_id, product_name, count(product.product_id) AS total_sold FROM items, product WHERE product.product_id=items.product_id group by product.product_id ORDER BY total_sold desc LIMIT 5');

    if (row.length > 0) {
      return row;
    }

    return [];
  };

  static getTotalProduct = async () => {
    const row: any = await makeQuery('SELECT count(product_id) as total_product FROM product WHERE product_status="active"');

    if (row.length > 0) {
      return row[0].total_product;
    }

    return 0;
  };

  static getTotalProductSold = async () => {
    const row: any = await makeQuery('SELECT SUM(item_quantity) as total_product_sold FROM items');

    if (row.length > 0) {
      return row[0].total_product_sold;
    }

    return 0;
  };
}
