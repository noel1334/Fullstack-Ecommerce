import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import TotalCart from "../Component/TotalCart";
import Title from "../Component/Title";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { UserContext } from "../Context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import PaystackPop from "@paystack/inline-js";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import axios from "axios";
import ShippingAddressForm from "../Component/ShippingAddressForm";
import PaymentMethodSelector from "../Component/PaymentMethodSelector";
import { loadStripe } from "@stripe/stripe-js";

const PlaceOrder = () => {
  const { currency, delivery_fees } = useContext(ShopContext);
  const { currentUser, handleLinkClick, BASE_URL } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);
  const [method, setMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/auth/address/${currentUser.id}`
        );

        if (response.status === 200 && response.data?.address?.addresses) {
          const address = response.data.address.addresses;

          // Set shipping address
          setShippingAddress({
            name: address.name || "",
            email: address.email || "",
            phone: address.phone || "",
            address: address.address || "",
          });

          // Set location
          setLocation({
            selectedCountry: { value: address.country, label: address.country },
            selectedState: { value: address.state, label: address.state },
            selectedLGA: { value: address.lga, label: address.lga },
          });
        } else {
        }
      } catch (error) {
        console.error("Failed to fetch shipping details:", error);
        toast.error("Error fetching shipping details.");
      }
    };

    fetchShippingDetails();
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

  const payWithMonnify = () => {
    if (window.MonnifySDK) {
      window.MonnifySDK.initialize({
        amount: totalWithDelivery,
        currency: "NGN",
        reference: generateTxRef(),
        customerName: shippingAddress.name,
        customerEmail: shippingAddress.email,
        apiKey: "MK_TEST_B92LLB1JKJ",
        contractCode: "3075893244",
        paymentDescription: "Order Payment",
        paymentMethods: [
          "CARD",
          "ACCOUNT_TRANSFER",
          "USSD",
          "QR",
          "PHONE_NUMBER",
        ],
        onComplete: (response) => {
          handleMonnifyResponse(response);
        },
        onClose: () => {
          console.log("Monnify payment modal closed.");
        },
      });
    } else {
      console.error("Monnify SDK not loaded.");
    }
  };
  const handleMonnifyResponse = async (response) => {
    if (response.status === "SUCCESS") {
      try {
        const verificationResponse = await axios.post(
          `${BASE_URL}/api/orders/verifyMonnifyPaymentAndCreateOrder`,
          {
            reference: response.transactionReference,
            orderDetails,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (verificationResponse.status === 201) {
          clearCart();
          navigate("/orders", { state: verificationResponse.data.order });
          toast.success("Order placed successfully!");
        } else {
          console.error("Verification failed:", verificationResponse.data);
          toast.error(
            verificationResponse.data.message || "Payment verification failed."
          );
        }
      } catch (error) {
        console.error(
          "Error during Monnify verification:",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message ||
            "An error occurred during payment verification. Please try again."
        );
      }
    } else {
      toast.error("Payment was not successful.");
    }
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
      const stripePromise = loadStripe(
        "pk_test_51Qh23NHvpHjLqrRdFYYvjDFA96YQRg4YDqDZIYiTD2OpWI3Tiua4nBgBdZuhTxqhqKnfdlkuzjrUFpXdl46WcKtO000jo8lK04"
      );

      const { data } = await axios.post(
        `${BASE_URL}/api/orders/createStripeSession`,
        { amount, email, name, phone, orderDetails }
      );

      if (data.sessionId) {
        const stripe = await stripePromise;

        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("Stripe Checkout Error:", error.message);
          toast.error(
            error.message || "Failed to redirect to Stripe Checkout."
          );

          // Delete incomplete order
          await axios.delete(
            `${BASE_URL}/api/orders/delete/${data.orderReference}`
          );
          console.log("Incomplete order deleted due to Stripe Checkout error.");
        }
      } else {
        toast.error("Failed to create Stripe session. Please try again.");
      }
    } catch (error) {
      console.error("Error creating Stripe session:", error.message || error);

      // Attempt to delete incomplete order
      if (error.response?.data?.orderReference) {
        await axios.delete(
          `${BASE_URL}/api/orders/delete/${error.response.data.orderReference}`
        );
        console.log("Incomplete order deleted due to backend error.");
      }

      toast.error(
        error.response?.data?.message ||
          "An error occurred while creating Stripe payment session. Please try again."
      );
    }
  };

  const handleFlutterPayment = useFlutterwave(config);
  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setIsLoading(false);
        return;
      }

      if (!method) {
        setErrors({ method: "Please select a payment method." });
        // setIsLoading(false);
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
                // await new Promise((resolve) => setTimeout(resolve, 2000));
                navigate("/orders", { state: verificationResponse.data.order });
                toast.success("Order placed successfully!");
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

            closePaymentModal();
          },
          onClose: () => {
            console.log("Payment Modal Closed");
          },
        });
      } else if (method === "monnify") {
        payWithMonnify();
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
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80-vh] border-t sm:px-1 lg:px-1 py-8">
      <div className="flex flex-col gap-4 w-full sm:max-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />
        </div>
        <ShippingAddressForm
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
          location={location}
          setLocation={setLocation}
          errors={errors}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className="mt-12">
        <div className="mt-8 min-w-80 bg-white p-6 rounded-lg shadow-lg">
          <TotalCart cart={cart} currency={currency} />
          <PaymentMethodSelector
            method={method}
            setMethod={setMethod}
            errors={errors}
          />
          <div className="w-full mt-8">
            <button
              onClick={handlePlaceOrder}
              disabled={!method || isLoading}
              className={`px-16 py-3 text-sm rounded-md ${
                method && !isLoading
                  ? "bg-black text-white hover:bg-gray-600 active:bg-black"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
