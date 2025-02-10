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
        paymentMethod: method === "master" ? "payStack" : method,
      };

      if (method === "master") {
        if (typeof window.PaystackPop === "undefined") {
          throw new Error(
            "Paystack script is not loaded. Please try again later."
          );
        }

        const email = shippingAddress.email;
        const amountInKobo = totalWithDelivery * 100;

        const popup = new PaystackPop();
        popup.newTransaction({
          key: "pk_test_95ca2e4025f886c4905d23d2589e2601dce7e280",
          email,
          amount: amountInKobo,
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
                toast.success("Order placed successfully!");
                navigate("/orders", { state: verificationResponse.data.order });
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
      } else {
        toast.error("Only Paystack payment is supported in this workflow.");
      }
    } catch (error) {
      console.error("Error during order placement:", error.message || error);
      toast.error(
        error?.message ||
          "An error occurred during order placement. Please try again."
      );
    }
  };