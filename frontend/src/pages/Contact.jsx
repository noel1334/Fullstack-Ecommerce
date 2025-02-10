import React from "react";
import Title from "../Component/Title";

const Contact = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-4">
        <div className="text-2xl mb-3">
          <Title text1={"CONTACT"} text2={"US."} />
        </div>
      </div>

      {/* Contact Form and Details */}
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                rows="5"
                className="w-full min-h-36 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Write your message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Contact Information
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Have questions or need assistance? Reach out to us through the
            following channels:
          </p>
          <ul className="space-y-4">
            <li>
              <strong className="text-gray-800">Address:</strong>
              <p className="text-gray-600">
                123 E-Commerce Street, Suite 100, Tech City, TX 75000
              </p>
            </li>
            <li>
              <strong className="text-gray-800">Phone:</strong>
              <p className="text-gray-600">+1 (800) 123-4567</p>
            </li>
            <li>
              <strong className="text-gray-800">Email:</strong>
              <p className="text-gray-600">support@ecommerceapp.com</p>
            </li>
            <li>
              <strong className="text-gray-800">Business Hours:</strong>
              <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Our Location
        </h2>
        <div className="rounded-lg shadow-lg overflow-hidden">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31383.269241336246!2d7.421687869775949!3d10.507860617898157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104d355834371775%3A0x480195979abfe174!2s800283%2C%20Kaduna!5e0!3m2!1sen!2sng!4v1680004506655!5m2!1sen!2sng"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
