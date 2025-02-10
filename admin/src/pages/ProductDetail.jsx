import React, { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Title from "../Component/Title";
import { ShopContext } from "../Context/ShopContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const foundProduct = products?.find((product) => product._id === id);
    setProduct(foundProduct);
    setSelectedImage(foundProduct?.image?.[0] || "");
  }, [id, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="text-blue-500 hover:underline text-lg">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="pb-4 text-3xl">
        <Title text1={"PRODUCT"} text2={"DETAILS"} />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start p-4 rounded-lg bg-gray-700">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4 md:w-1/2  rounded-lg bg-gray-900 p-4">
          <div className="flex gap-3 mb-4 overflow-x-auto">
            {product.image &&
              product.image.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg border-2 ${
                    selectedImage === image
                      ? "border-blue-500"
                      : "border-transparent"
                  } hover:border-gray-500 transition duration-300 cursor-pointer`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
          </div>
          <img
            src={selectedImage}
            alt="Main Product"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6 md:w-1/2 rounded-lg bg-gray-900 h-screen w-full p-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-300 text-lg">{product.description}</p>

          {/* Sizes */}
          {product.size && (
            <div>
              <p className="font-semibold text-lg mb-2">Available Sizes:</p>
              <div className="flex gap-3">
                {product.size.map((size, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 border border-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-700 transition duration-300"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.color && (
            <div>
              <p className="font-semibold text-lg mb-2">Available Colors:</p>
              <div className="flex gap-3">
                {product.color.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border border-gray-700 cursor-pointer"
                    style={{ backgroundColor: color.trim() }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <p className="text-2xl font-bold text-green-400">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Back to Products Link */}
          <div className="mt-4">
            <Link
              to="/products"
              className="text-blue-500 hover:underline text-lg"
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
