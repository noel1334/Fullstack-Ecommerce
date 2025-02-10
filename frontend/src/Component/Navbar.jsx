import { Link, NavLink, useLocation } from "react-router-dom";
import { FiHeart, FiLogOut, FiSearch, FiShoppingCart } from "react-icons/fi";
import { FcBusinessman } from "react-icons/fc";
import {
  FaBars,
  FaRegistered,
  FaShippingFast,
  FaSignInAlt,
  FaTachometerAlt,
  FaTimes,
  FaUserAlt,
} from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../Context/UserContext";
import { WishCartContext } from "../Context/WishCartContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const { setShowSearch, showSearch } = useContext(ShopContext);
  const { cart } = useContext(CartContext);
  const { totalWishCartItems } = useContext(WishCartContext);
  const { currentUser, handleLinkClick, logout } = useContext(UserContext);
  const location = useLocation();

  // Calculate the total number of items in the cart
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (userMenuVisible) {
      const timer = setTimeout(() => {
        setUserMenuVisible(false);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [userMenuVisible]);

  return (
    <div className="fixed top-0 left-0 w-full bg-slate-100 border-b-2 border-gray-200 z-50">
      <div className="flex items-center justify-between py-2 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        {/* Logo */}
        <Link
          onClick={() => {
            setUserMenuVisible(false);
            handleLinkClick();
          }}
          to="/"
        >
          <img src="/logo.png" alt="Logo" className="w-12 cursor-pointer" />
        </Link>

        {/* Desktop Menu */}
        <ul
          onClick={() => {
            setUserMenuVisible(false);
            handleLinkClick();
          }}
          className="hidden sm:flex gap-5 text-sm text-gray-700"
        >
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>Home</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/products" className="flex flex-col items-center gap-1">
            <p>Products</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>About</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>Contact</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6">
          {!showSearch ? (
            <FiSearch
              onClick={() => {
                setShowSearch(true);
                setUserMenuVisible(false);
                handleLinkClick();
              }}
              className="w-5 cursor-pointer"
            />
          ) : location.pathname === "/products" ? (
            <FaTimes
              onClick={() => {
                setShowSearch(false);
                setUserMenuVisible(false);
                handleLinkClick();
              }}
              className="w-5 cursor-pointer"
            />
          ) : (
            <FiSearch
              onClick={() => {
                setShowSearch(true);
                setUserMenuVisible(false);
                handleLinkClick();
              }}
              className="w-5 cursor-pointer"
            />
          )}

          {/* Shopping Cart Icon */}
          <Link
            onClick={() => {
              setUserMenuVisible(false);
              handleLinkClick();
            }}
            to="/favorite-cart"
            className="relative"
          >
            <FiHeart color="red" className="w-5 min-w-5" />
            <p className="absolute right-[-8px] top-[-8px] w-4 text-center leading-4 bg-red-800 text-white aspect-square rounded-full text-[8px]">
              {totalWishCartItems}
            </p>
          </Link>
          <Link
            onClick={() => {
              setUserMenuVisible(false);
              handleLinkClick();
            }}
            to="/cart"
            className="relative"
          >
            <FiShoppingCart className="w-5 min-w-5" />
            <p className="absolute right-[-8px] top-[-8px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {currentUser ? totalCartItems : "0"}
            </p>
          </Link>
          {/* User Icon with Dropdown Toggle */}
          {location.pathname !== "/login" &&
            location.pathname !== "/register" && (
              <div className="relative ">
                <FcBusinessman
                  className="cursor-pointer text-xl "
                  onClick={() => setUserMenuVisible(!userMenuVisible)}
                />

                {userMenuVisible && (
                  <div className="absolute right-0 top-8 flex flex-col w-36 gap-2 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-lg">
                    {currentUser ? (
                      <span className="capitalize font-bold text-gray-900">
                        {currentUser.name}
                      </span>
                    ) : (
                      <>
                        <Link
                          onClick={() => {
                            setUserMenuVisible(false);
                            handleLinkClick();
                          }}
                          className="cursor-pointer hover:text-green-600 text-sm flex items-center gap-2 text-green-400"
                          to={"/login"}
                        >
                          <FaSignInAlt className="cursor-pointer" />
                          Login
                        </Link>
                        <Link
                          onClick={() => {
                            setUserMenuVisible(false);
                            handleLinkClick();
                          }}
                          className="cursor-pointer hover:text-blue-600 text-sm flex items-center gap-2 text-blue-400"
                          to={"/register"}
                        >
                          <FaRegistered className="cursor-pointer" />
                          Register
                        </Link>
                      </>
                    )}
                    {currentUser && (
                      <>
                        {currentUser.isAdmin ? (
                          <Link
                            to={"/dashboard"}
                            onClick={() => {
                              setUserMenuVisible(false);
                              handleLinkClick();
                            }}
                            className="cursor-pointer hover:text-orange-600 text-sm flex items-center gap-2 text-orange-400"
                          >
                            <FaTachometerAlt className="cursor-pointer" />
                            Dashboard
                          </Link>
                        ) : (
                          <Link
                            to={"/profile"}
                            onClick={() => {
                              setUserMenuVisible(false);
                              handleLinkClick();
                            }}
                            className="cursor-pointer hover:text-orange-600 text-sm flex items-center gap-2 text-orange-400"
                          >
                            <FaUserAlt className="cursor-pointer" />
                            My Profile
                          </Link>
                        )}
                      </>
                    )}
                    {currentUser && (
                      <Link
                        onClick={() => {
                          setUserMenuVisible(false);
                          handleLinkClick();
                        }}
                        to="/orders"
                        className="cursor-pointer hover:text-blue-600 text-sm flex items-center gap-2 text-blue-400"
                      >
                        <FaShippingFast className="cursor-pointer" />
                        Order
                      </Link>
                    )}
                    {currentUser && (
                      <p
                        onClick={() => {
                          logout();
                          setUserMenuVisible(false);
                        }}
                        className="cursor-pointer hover:text-red-600 text-sm flex items-center gap-2 text-red-400"
                      >
                        <FiLogOut className="cursor-pointer " />
                        Logout
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

          <FaBars
            onClick={() => {
              setVisible(true);
              setUserMenuVisible(false);
            }}
            className="w-5 cursor-pointer sm:hidden"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-full bg-white z-40 transform transition-transform ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          {/* Close Button */}
          <div
            onClick={() => {
              setVisible(false);
              setUserMenuVisible(false);
            }}
            className="flex items-center gap-4 p-3 border-b cursor-pointer"
          >
            <FaTimes className="w-4 cursor-pointer" />
            <p className="">Back</p>
          </div>

          {/* Links */}
          <div className="flex flex-col h-full px-6 gap-6">
            <NavLink
              onClick={() => {
                setVisible(false);
                setUserMenuVisible(false);
                handleLinkClick();
              }}
              className="text-lg"
              to={`/`}
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => {
                setVisible(false);
                setUserMenuVisible(false);
                handleLinkClick();
              }}
              className="text-lg"
              to={`/products`}
            >
              Products
            </NavLink>
            <NavLink
              onClick={() => {
                setVisible(false);
                setUserMenuVisible(false);
                handleLinkClick();
              }}
              className="text-lg"
              to={`/about`}
            >
              About
            </NavLink>
            <NavLink
              onClick={() => {
                setVisible(false);
                setUserMenuVisible(false);
                handleLinkClick();
              }}
              className="text-lg"
              to={`/contact`}
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
