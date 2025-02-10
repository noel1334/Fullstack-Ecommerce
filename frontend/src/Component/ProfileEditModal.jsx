import React, { useState } from "react";
import axios from "axios";
import { FaSave, FaTimes } from "react-icons/fa";
import LocationSelector from "../Component/LocationSelector";
import { toast } from "react-toastify";

const ProfileEditModal = ({
  user,
  setIsEditing,
  fetchUserProfile,
  BASE_URL,
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.addresses?.phone || "",
    address: user?.addresses?.address || "",
  });

  const [location, setLocation] = useState({
    selectedCountry: {
      value: user?.addresses?.country || "",
      label: user?.addresses?.country || "",
    },
    selectedState: {
      value: user?.addresses?.state || "",
      label: user?.addresses?.state || "",
    },
    selectedLGA: {
      value: user?.addresses?.lga || "",
      label: user?.addresses?.lga || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = user._id;
      const updatedData = {
        userId: userId,
        address: {
          ...formData,
          country: location.selectedCountry.label,
          state: location.selectedState.label,
          lga: location.selectedLGA.label,
        },
      };
      const response = await axios.put(
        `${BASE_URL}/api/auth/saveAddress`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("user details  updated successfully!");
      } else {
        console.error("Failed to update address:", response.data);
        toast.error("Failed to update address.");
      }
      fetchUserProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-xl shadow-xl space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Edit Profile
        </h2>
        <form className="space-y-4">
          {/* Name and Email in a single row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Phone and Address in a second row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location Selector Component */}
          <LocationSelector location={location} setLocation={setLocation} />
        </form>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <FaSave className="mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
