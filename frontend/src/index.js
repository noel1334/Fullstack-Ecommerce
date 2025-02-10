import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import ShopContextProvider from "./Context/ShopContext";
import { UserProvider } from "./Context/UserContext";
import { CartProvider } from "./Context/CartContext";
import { WishCartProvider } from "./Context/WishCartContext";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <ShopContextProvider>
        <WishCartProvider>
          <CartProvider>
            <App/>
          <ToastContainer />
          </CartProvider>
        </WishCartProvider>
      </ShopContextProvider>
    </UserProvider>
  </React.StrictMode>
);

