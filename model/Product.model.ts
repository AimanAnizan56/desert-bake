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
    const data: any = await makeQuery('SELECT * FROM product');

    return data;
  };

  static getProduct = async (id: number) => {
    const data = await makeQuery('SELECT * FROM product WHERE product_id=?', [id]);

    return data;
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
}
