import React from "react";
import Title from "./Title";

const PaymentMethodSelector = ({ method, setMethod, errors }) => {
  return (
    <div>
      <div className="mt-12">
        <div className="text-xl sm:text-2xl my-3 font-semibold">
          <Title text1={" PAYMENT "} text2={"METHOD"} />
        </div>
        <div className="flex gap-4 flex-col flex-1 lg:flex-row">
          {/* Monnify Payment Method */}
          <div
            onClick={() => setMethod("monnify")}
            className={`flex items-center lg:flex-col gap-3 border p-4 rounded-lg cursor-pointer hover:shadow-md transition ${
              method === "monnify" ? "border-green-500" : "border-gray-300"
            }`}
          >
            <p
              className={`w-4 h-4 border rounded-full flex-shrink-0 ${
                method === "monnify" ? "bg-green-500" : ""
              }`}
            ></p>
            <img
              src="/monifyLogo.jpeg"
              alt="Monnify Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm lg:text-base font-medium">Monnify</span>
          </div>

          {/* Flutterwave Payment Method */}
          <div
            onClick={() => setMethod("flutterwave")}
            className={`flex items-center lg:flex-col gap-3 border p-4 rounded-lg cursor-pointer hover:shadow-md transition ${
              method === "flutterwave" ? "border-green-500" : "border-gray-300"
            }`}
          >
            <p
              className={`w-4 h-4 border rounded-full flex-shrink-0 ${
                method === "flutterwave" ? "bg-green-500" : ""
              }`}
            ></p>
            <img
              src="/flutterwaveLogo.png"
              alt="Flutterwave Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm lg:text-base font-medium">
              Flutterwave
            </span>
          </div>

          {/* Paystack Payment Method */}
          <div
            onClick={() => setMethod("paystack")}
            className={`flex items-center lg:flex-col gap-3 border p-4 rounded-lg cursor-pointer hover:shadow-md transition ${
              method === "paystack" ? "border-green-500" : "border-gray-300"
            }`}
          >
            <p
              className={`w-4 h-4 border rounded-full flex-shrink-0 ${
                method === "paystack" ? "bg-green-500" : ""
              }`}
            ></p>
            <img
              src="paystackLogo.png"
              alt="Paystack Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm lg:text-base font-medium">Paystack</span>
          </div>
          {/* stripe Payment Method */}
          <div
            onClick={() => setMethod("stripe")}
            className={`flex items-center lg:flex-col gap-3 border p-4 rounded-lg cursor-pointer hover:shadow-md transition ${
              method === "stripe" ? "border-green-500" : "border-gray-300"
            }`}
          >
            <p
              className={`w-4 h-4 border rounded-full flex-shrink-0 ${
                method === "stripe" ? "bg-green-500" : ""
              }`}
            ></p>
            <img
              src="stripeLogo.png"
              alt="Stripe Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm lg:text-base font-medium">Stripe</span>
          </div>
        </div>

        {/* Error Message */}
        {errors.method && (
          <p className="text-red-500 text-sm mt-3">{errors.method}</p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
