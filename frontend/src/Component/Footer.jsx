import React from "react";
import { FaComment, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14  mt-40 text-sm">
        <div>
          <Link to="/">
            <img
              src="/logo.png"
              alt=""
              className=" w-20 cursor-pointer mb-5 "
            />
          </Link>
          <p className="w-full md:w-2/3 text-gray-600 mb-5">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim
            nulla, eligendi, voluptate dolores praesentium, corrupti nihil
            ducimus sint corporis itaque ipsum animi.
          </p>
        </div>
        <div className="mb-5">
          <p className="text-xl font-medium my-3 ">COMPONY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <Link className="hover:text-gray-800" to={`/`}>
              Home
            </Link>
            <Link className="hover:text-gray-800" to={`about`}>
              About Us.
            </Link>
            <Link className="hover:text-gray-800" to={`contact`}>
              Contact
            </Link>
            <Link className="hover:text-gray-800">Delivery</Link>
            <Link to={"/privacy-policy"} className="hover:text-gray-800">
              Privacy Policy
            </Link>
          </ul>
        </div>
        <div className="mb-5">
          <p className="text-xl font-medium my-3">GET IN TOUCH </p>
          <ul className="flex flex-col font-medium mb-5">
            <li className="flex gap-2 items-center">
              <FaComment />
              <a
                className="hover:text-orange-700"
                href="mailto:mystore@gmailcom"
              >
                mystore@gmailcom
              </a>
            </li>
            <li className="flex gap-2 items-center">
              <FaPhoneAlt />
              <a className="hover:text-orange-700" href="tel:+2348103490626">
                +234-810-349-0626
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="">
        <hr className="h-1 bg-gray-200 " />
        <p className="py-10 text-sm text-center">
          &copy; {new Date().getFullYear()} MyStore.com App. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
