import React from "react";
import LocationSelector from "../Component/LocationSelector";

const ShippingAddressForm = ({
  shippingAddress,
  setShippingAddress,
  location,
  setLocation,
  errors,
  handleSubmit,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  return (
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
          {errors.lga && <p className="text-red-500 text-sm">{errors.lga}</p>}
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddressForm;
