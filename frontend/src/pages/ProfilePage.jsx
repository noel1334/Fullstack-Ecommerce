import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import ProfileEditModal from "../Component/ProfileEditModal";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { BASE_URL } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500">User not found!</div>
    );
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="bg-gray-800 text-white p-6 text-center">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700"
          />
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-gray-300">{user?.role || "User"}</p>
        </div>

        {/* Contact Information */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Contact Information
          </h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-600">
              <FaEnvelope className="mr-2" />
              <a href={`mailto:${user?.email}`} className="hover:underline">
                {user?.email}
              </a>
            </div>
            <div className="flex items-center text-gray-600">
              <FaPhone className="mr-2" />
              <a
                href={`tel:${user?.addresses?.phone}`}
                className="hover:underline"
              >
                {user?.addresses?.phone || "Not provided"}
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              {user?.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="text-blue-700 text-xl hover:text-blue-800" />
                </a>
              )}
              {user.twitter && (
                <a
                  href={user?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-blue-500 text-xl hover:text-blue-600" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Address</h2>
          {user?.addresses ? (
            <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <p>
                <FaMapMarkerAlt className="inline mr-2 text-gray-600" />
                <span className="font-bold">Address:</span>{" "}
                {user.addresses.address}, {user?.addresses?.lga},{" "}
                {user.addresses.state}, {user?.addresses?.country}
              </p>
              <p>
                <span className="font-bold">Phone:</span>{" "}
                {user?.addresses?.phone}
              </p>
              <p>
                <span className="font-bold">Email:</span>{" "}
                {user?.addresses?.email}
              </p>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">No address added.</p>
          )}
        </div>

        {/* Edit Button */}
        <div className="p-6 text-right border-t border-gray-200">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 flex items-center"
            onClick={handleEditClick}
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditing && (
        <ProfileEditModal
          user={user}
          setIsEditing={setIsEditing}
          fetchUserProfile={fetchUserProfile}
          BASE_URL={BASE_URL}
        />
      )}
    </div>
  );
};

export default ProfilePage;
