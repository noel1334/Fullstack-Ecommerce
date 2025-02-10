import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { FaStar, FaStarHalf } from "react-icons/fa";
import RelatedProducts from "../Component/RelatedProducts";
import Loading from "../Component/Loading";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../Context/UserContext";
import { WishCartContext } from "../Context/WishCartContext";

function Product() {
  const { productId } = useParams();
  const { products, currency, isLoading, error, fetchProducts } =
    useContext(ShopContext);
  const { currentUser } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishCart } = useContext(WishCartContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const topRef = useRef(null);

  useEffect(() => {
    const fetchProductData = () => {
      const foundProduct = products.find((item) => item._id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.image[0]);
        if (foundProduct.color.length > 0) setColor(foundProduct.color[0]);
        if (foundProduct.size.length > 0) setSize(foundProduct.size[0]);
      } else {
        fetchProducts();
      }
    };

    if (!isLoading && !error) {
      fetchProductData();
    }
  }, [productId, products, isLoading, error, fetchProducts]);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`top-20 border-t-2 pt-10 transition-opacity ease-in duration-500 ${
        isLoading || error ? "opacity-50" : "opacity-100"
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 bg-opacity-50 z-50 flex items-center justify-center cursor-not-allowed">
          <div className="opacity-100">
            <p>Loading...</p>
            <Loading />
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-50 z-50 flex items-center justify-center cursor-not-allowed">
          <div className="opacity-100 text-white">
            <p>Error: {error}</p>
          </div>
        </div>
      )}

      <div
        ref={topRef}
        className={`flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t ${
          isLoading || error ? "opacity-70 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll scrollbar-hidden justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData &&
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt=""
                />
              ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-1">{productData?.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <FaStar color="gold" className="w-5" />
            <FaStar color="gold" className="w-5" />
            <FaStar color="gold" className="w-5" />
            <FaStar color="gold" className="w-5" />
            <FaStarHalf color="gold" className="w-5" />
            <p className="pl-2">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData?.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5 text-justify">
            {productData?.description}
          </p>

          <div className="flex flex-col gap-4 my-5">
            <p>Choose color</p>
            <div className="flex items-center gap-4">
              {productData?.color.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setColor(item)}
                  className={`w-14 h-14 rounded-full cursor-pointer flex items-center justify-center transition ${
                    color === item
                      ? "ring-4 ring-gray-300 shadow-lg"
                      : "shadow-md shadow-gray-500"
                  }`}
                  style={{ backgroundColor: item }}
                >
                  {color === item && (
                    <div className="text-gray-300 font-bold text-xs uppercase">
                      {item}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 my-5">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData?.size.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 items-center justify-normal">
            <button
              onClick={() => addToWishCart(productData, color, size, image)}
              className="bg-red-400 px-6 py-3 uppercase text-white text-sm active:bg-red-700"
            >
              ADD TO Wish-List
            </button>
            {!currentUser ? (
              <Link
                to={"/login"}
                className="bg-black px-8 py-3 text-white text-sm active:bg-gray-700"
              >
                ADD TO CART
              </Link>
            ) : (
              <button
                onClick={() => addToCart(productData, color, size, image)}
                className="bg-black px-8 py-3 text-white text-sm active:bg-gray-700"
              >
                ADD TO CART
              </button>
            )}
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and review */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">(122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates buying
            and selling of products over the internet.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            magnam iusto, rem accusantium illo non aliquid animi, voluptate
            consequatur reiciendis.
          </p>
        </div>
      </div>

      <RelatedProducts
        productId={productData?._id}
        category={productData?.category}
        subcategory={productData?.subcategory}
        onClick={scrollToTop}
      />
    </div>
  );
}

export default Product;
