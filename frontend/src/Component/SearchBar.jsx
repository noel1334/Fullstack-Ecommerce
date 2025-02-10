import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch } = useContext(ShopContext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("products") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  return showSearch && visible ? (
    <div className="border-t border-b text-center top-20">
      <div className="inline-flex items-center justify-center border border-gray-500 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 ">
        <input
          className="flex-1 outline-none bg-inherit text-sm "
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for item"
        />
        <FaSearch className="w-8 cursor-pointer" />
      </div>
    </div>
  ) : null;
};

export default SearchBar;
