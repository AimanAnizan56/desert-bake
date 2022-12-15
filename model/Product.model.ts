export default class Product {
  private readonly id!: number;
  private name: string;
  private price: number;
  private description: string;
  private type: string;
  private imageBlob!: Blob;
  private imagePath!: string;

  constructor(name: string, price: number, description: string, type: string) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.type = type;
  }

  setImageBlob(imageBlob: Blob) {
    this.imageBlob = imageBlob;
  }

  setImagePath(imagePath: string) {
    this.imagePath = imagePath;
  }
}
