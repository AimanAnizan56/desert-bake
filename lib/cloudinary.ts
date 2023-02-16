class Cloudinary {
  private cloudinary = require('cloudinary').v2;
  constructor() {
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  uploadImage = async (image_path: any) => {
    try {
      const result = await this.cloudinary.uploader.upload(image_path, {
        resource_type: 'image',
      });
      console.log('====================================');
      console.log('Result upload image');
      console.log(result);
      console.log('====================================');

      const { public_id, format } = result;
      const filename = `${public_id}.${format}`;
      return filename;
    } catch (err) {
      console.log('====================================');
      console.log('Error Cloudinary');
      console.log(err);
      console.log('====================================');
    }
  };
}

export default Cloudinary;
