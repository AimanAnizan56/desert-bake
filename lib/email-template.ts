import Product from '../model/Product.model';

export const emailTemplate = (product: Product) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>New Product Announcement</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #F5F5F5;
        color: #333;
      }
      h1 {
        font-size: 2em;
        color: #AF7950;
        text-align: center;
        margin-top: 2em;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 1em;
      }
      .product-image {
        text-align: center;
        margin-bottom: 2em;
      }
      .product-image img {
        max-width: 100%;
      }
      .product-info {
        text-align: left;
        margin-bottom: 2em;
      }
      .product-info h2 {
        font-size: 1.5em;
        color: #AF7950;
        margin-top: 0;
      }
      .product-info p {
        font-size: 1em;
        line-height: 1.5em;
        margin-top: 0.5em;
      }
      .cta {
        background-color: #AF7950;
        color: #fff;
        text-align: center;
        padding: 1em;
        text-decoration: none;
        margin-top: 2em;
        display: block;
      }
      .cta:hover {
        background-color: #7A5A32;
      }
    </style>
  </head>
  <body>
    <h1>New Product Announcement</h1>
    <div class="container">
      <div class="product-image">
        <img src="cid:product.jpg" alt="${product.getProductName()}">
      </div>
      <div class="product-info">
        <h2>${product.getProductName()}</h2>
        <p>${product.getProductDescription()}</p>
        <a href="https://google.com/search?q=${product.getProductName()}" class="cta">Learn More</a>
      </div>
    </div>
  </body>
</html>
`;
};
