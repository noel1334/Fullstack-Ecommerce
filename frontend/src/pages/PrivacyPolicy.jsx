import React from "react";
import Title from "../Component/Title";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="py-8">
        <div className="text-2xl mb-6">
          <Title text1={"Privacy"} text2={"Policy"} />
        </div>
        <div className="container text-start">
          <p className="text-lg text-gray-600">
            Welcome to our Privacy Policy page. Your privacy is of paramount
            importance to us. This Privacy Policy document outlines the types of
            personal information that is received and collected by our website
            and how it is used.
          </p>
        </div>
      </div>

      {/* Policy Information Section */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800">
          1. Information We Collect
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We collect personal information when you register, place an order, or
          interact with our website. This includes:
        </p>
        <ul className="list-inside list-disc text-gray-600 mt-2">
          <li>Personal details (name, email, phone number)</li>
          <li>Payment and transaction information</li>
          <li>IP address and device information</li>
          <li>Browsing history and preferences</li>
        </ul>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800">
          2. How We Use Your Information
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We use the information we collect for various purposes, including:
        </p>
        <ul className="list-inside list-disc text-gray-600 mt-2">
          <li>To process and manage your orders</li>
          <li>To improve customer service and user experience</li>
          <li>To personalize the content and advertisements you see</li>
          <li>To send you promotional offers and updates</li>
          <li>To comply with legal obligations</li>
        </ul>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800">3. Data Security</h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We take the security of your personal information seriously. We
          implement various security measures, including encryption and secure
          servers, to protect your data from unauthorized access, alteration, or
          disclosure.
        </p>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800">
          4. Third-Party Services
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We do not share your personal information with third parties except in
          the following cases:
        </p>
        <ul className="list-inside list-disc text-gray-600 mt-2">
          <li>With service providers who assist in running our website</li>
          <li>For legal requirements or obligations</li>
          <li>With your consent or authorization</li>
        </ul>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800">5. Your Rights</h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          You have the right to:
        </p>
        <ul className="list-inside list-disc text-gray-600 mt-2">
          <li>Access the personal information we hold about you</li>
          <li>Request corrections or updates to your information</li>
          <li>Request the deletion of your personal information</li>
          <li>Opt-out of receiving marketing communications</li>
        </ul>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800">
          6. Changes to This Privacy Policy
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We reserve the right to update or change this Privacy Policy at any
          time. Any changes will be reflected on this page with an updated
          "effective date" at the top of the page.
        </p>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800">7. Contact Us</h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p className="mt-2 text-gray-600">Email: support@example.com</p>
        <p className="mt-2 text-gray-600">Phone: +123-456-7890</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
