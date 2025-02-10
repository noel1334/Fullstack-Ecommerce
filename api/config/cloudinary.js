import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'ecommerce', // Replace with your desired Cloudinary folder
      use_filename: true,
      unique_filename: false,
      resource_type: 'image',
    });

    return result.secure_url; // Return the Cloudinary image URL
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
};
