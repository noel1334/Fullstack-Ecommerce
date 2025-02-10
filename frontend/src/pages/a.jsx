import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import TotalCart from "../Component/TotalCart";
import LocationSelector from "../Component/LocationSelector";
import Title from "../Component/Title";
import { FaAccusoft, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../Context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import PaystackPop from "@paystack/inline-js";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const PlaceOrder = () => {
  const { currency, delivery_fees } = useContext(ShopContext);
  const { currentUser, handleLinkClick, BASE_URL } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);
  const [method, setMethod] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: currentUser?.name || "",
    address: currentUser?.address?.address || "",
    email: currentUser?.email || "",
    phone: currentUser?.address?.phone || "",
  });
  const clearCart = () => {
    setCart([]);
  };

  const [location, setLocation] = useState({
    selectedCountry: null,
    selectedState: null,
    selectedLGA: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  useEffect(() => {
    if (currentUser?.address?.[0]) {
      console.log("Current user address:", currentUser.address[0]);
      setLocation({
        selectedCountry: { label: currentUser.address[0].country },
        selectedState: { label: currentUser.address[0].state },
        selectedLGA: { label: currentUser.address[0].lga },
      });
    }
  }, [currentUser]);

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.name) errors.name = "Name is required.";
    if (!shippingAddress.email) errors.email = "Email is required.";
    if (!shippingAddress.phone) errors.phone = "Phone number is required.";
    if (!shippingAddress.address) errors.address = "Address is required.";
    if (!location.selectedCountry) errors.country = "Country is required.";
    if (!location.selectedState) errors.state = "State is required.";
    if (!location.selectedLGA)
      errors.lga = "Local Government Area is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const fullAddress = {
        ...shippingAddress,
        country: location.selectedCountry?.label || "",
        state: location.selectedState?.label || "",
        lga: location.selectedLGA?.label || "",
      };

      try {
        const payload = {
          userId: currentUser.id,
          address: fullAddress,
        };
        const response = await axiosInstance.put("/auth/saveAddress", payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          toast.success("Shipping address updated successfully!");
        } else {
          console.error("Failed to update address:", response.data);
          toast.error("Failed to update address.");
        }
      } catch (error) {
        console.error(
          "Error updating address:",
          error.response?.data || error.message
        );
        toast.error(
          "Error updating address: " + (error.response?.data || error.message)
        );
      }
    }
  };

  const fullAddress = {
    ...shippingAddress,
    country: location.selectedCountry?.label || "",
    state: location.selectedState?.label || "",
    lga: location.selectedLGA?.label || "",
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalWithDelivery = cartTotal + delivery_fees;

  const orderDetails = {
    userId: currentUser.id,
    shippingDetails: fullAddress,
    cartItems: cart,
    totalAmount: totalWithDelivery,
    paymentMethod: method === "paystack" ? "payStack" : method,
  };

  const email = shippingAddress.email;
  const amountInKobo = totalWithDelivery * 100;
  const phone = shippingAddress.phone;
  const name = shippingAddress.name;

  const generateTxRef = () => {
    const timestamp = Date.now();
    return `MY_STORE_${timestamp}`;
  };
  const config = {
    public_key: "FLWPUBK_TEST-dc3c20fc42271500c2ba4c6ffb107e3b-X",
    tx_ref: generateTxRef(),
    amount: totalWithDelivery,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: { email, phone, name },
    customizations: {
      title: "orders Payment to my-stored",
      description: "Payment for items in cart",
      logo: "https://yourlogo.com/logo.jpg",
    },
  };
  const handleStripeCheckout = async (
    amount,
    email,
    name,
    phone,
    orderDetails,
    BASE_URL
  ) => {
    try {
      // Initialize Stripe
      const stripePromise = loadStripe(
        "pk_test_51Qh23NHvpHjLqrRdFYYvjDFA96YQRg4YDqDZIYiTD2OpWI3Tiua4nBgBdZuhTxqhqKnfdlkuzjrUFpXdl46WcKtO000jo8lK04"
      );

      // Call the backend to create a Stripe session
      const { data } = await axios.post(
        `${BASE_URL}/api/orders/createStripeSession`,
        {
          amount,
          email,
          name,
          phone,
          orderDetails,
        }
      );

      if (data.sessionId) {
        // Redirect to Stripe Checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("Stripe Checkout Error:", error.message);
          toast.error(
            error.message || "Failed to redirect to Stripe Checkout."
          );
        }
      } else {
        toast.error("Failed to create Stripe session. Please try again.");
      }
    } catch (error) {
      console.error("Error creating Stripe session:", error.message || error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating Stripe payment session. Please try again."
      );
    }
  };
  const handleFlutterPayment = useFlutterwave(config);
  const handlePlaceOrder = async () => {
    try {
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      if (!method) {
        setErrors({ method: "Please select a payment method." });
        return;
      }

      if (method === "paystack") {
        if (typeof window.PaystackPop === "undefined") {
          throw new Error(
            "Paystack script is not loaded. Please try again later."
          );
        }

        const trackingLink = `${BASE_URL}/api/orders`;

        const popup = new PaystackPop();
        popup.newTransaction({
          key: "pk_test_95ca2e4025f886c4905d23d2589e2601dce7e280",
          email,
          amount: amountInKobo,
          link: trackingLink,
          onSuccess: async (transaction) => {
            try {
              // Verify payment before creating the order
              const verificationResponse = await axios.post(
                `${BASE_URL}/api/orders/verifyPaymentAndCreateOrder`,
                {
                  reference: transaction.reference,
                  orderDetails,
                }
              );

              if (verificationResponse.status === 201) {
                clearCart();
                navigate("/orders", { state: verificationResponse.data.order });
                toast.success("Order placed successfully!");
                handleLinkClick();
              } else {
                toast.error(
                  verificationResponse.data.message ||
                    "Payment verification failed."
                );
              }
            } catch (verificationError) {
              console.error(
                "Error during payment verification and order creation:",
                verificationError.message
              );
              toast.error(
                "An error occurred during payment verification. Please try again."
              );
            }
          },
          onCancel: () => {
            toast.error("Payment was canceled. Please try again.");
          },
        });
      } else if (method === "flutterwave") {
        handleFlutterPayment({
          callback: async (response) => {
            if (response.status === "successful") {
              try {
                const verificationResponse = await axios.post(
                  `${BASE_URL}/api/orders/verifyFlutterwavePaymentAndCreateOrder`,
                  {
                    transactionId: response.transaction_id,
                    tx_ref: response.tx_ref,
                    orderDetails,
                  },
                  {
                    headers: { "Content-Type": "application/json" },
                  }
                );

                if (verificationResponse.status === 201) {
                  clearCart();
                  navigate("/orders", {
                    state: verificationResponse.data.order,
                  });
                  toast.success("Order placed successfully!");
                  handleLinkClick();
                } else {
                  toast.error(
                    verificationResponse.data.message ||
                      "Payment verification failed."
                  );
                }
              } catch (verificationError) {
                console.error(
                  "Error during backend verification:",
                  verificationError.response?.data || verificationError.message
                );
              }
            } else {
              toast.error("Payment failed or incomplete.");
            }

            closePaymentModal(); // Ensure modal is closed
          },
          onClose: () => {
            console.log("Payment Modal Closed");
          },
        });
      } else if (method === "stripe") {
        // Stripe Checkout
        await handleStripeCheckout(
          totalWithDelivery,
          shippingAddress.email,
          shippingAddress.name,
          shippingAddress.phone,
          orderDetails,
          BASE_URL
        );
      } else {
        toast.error("Only Paystack, Flutterwave, and Stripe are supported.");
      }
    } catch (error) {
      console.error("Error during order placement:", error.message || error);
      toast.error(
        error?.message ||
          "An error occurred during order placement. Please try again."
      );
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80-vh] border-t sm:px-1 lg:px-1 py-8">
      <div className="flex flex-col gap-4 w-full sm:max-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium cursor-pointer mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium cursor-pointer mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-full">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-medium cursor-pointer mb-2"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter your phone number"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-medium cursor-pointer mb-2"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter your address"
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="mt-3">
              <LocationSelector location={location} setLocation={setLocation} />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
              {errors.lga && (
                <p className="text-red-500 text-sm">{errors.lga}</p>
              )}
              <button
                type="submit"
                className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-12">
        <div className="mt-8 min-w-80 bg-white p-6 rounded-lg shadow-lg">
          <div>
            <TotalCart cart={cart} currency={currency} />
          </div>
          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod("stripe")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "stripe" ? "bg-green-500" : ""
                  }`}
                ></p>
                <FaCcPaypal color="blue" className="h-5 mx-3" />
              </div>
              <div
                onClick={() => setMethod("flutterwave")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "flutterwave" ? "bg-green-500" : ""
                  }`}
                ></p>
                <FaAccusoft color="#6772E5" className="h-5 mx-3" />
              </div>
              <div
                onClick={() => setMethod("paystack")}
                className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "paystack" ? "bg-green-500" : ""
                  }`}
                ></p>
                <FaCcMastercard color="#6772E5" className="h-5 mx-3" />
              </div>
            </div>
            {errors.method && (
              <p className="text-red-500 text-sm mt-3">{errors.method}</p>
            )}

            <div className="w-full mt-8">
              <button
                onClick={handlePlaceOrder}
                disabled={!method}
                className={`px-16 py-3 text-sm rounded-md ${
                  method
                    ? "bg-black text-white hover:bg-gray-600 active:bg-black"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
