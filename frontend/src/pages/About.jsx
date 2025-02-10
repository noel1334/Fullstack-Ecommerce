import React from "react";
import Title from "../Component/Title";

const About = () => {
  return (
    <div className=" min-h-screen">
      {/* Hero Section */}
      <div className=" py-6">
        <div className="text-2xl mb-6">
          <Title text1={"ABOUT"} text2={"US."} />
        </div>
      </div>

      {/* Mission Section */}
      <div className=" py-2">
        <div className="flex flex-col md:flex-row  md:space-x-8">
          <div className="md:w-1/2">
            <img
              src="/logo.png"
              alt="Our Mission"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 mt-4 md:mt-0">
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed text-justify">
              Our mission is to revolutionize online shopping by providing a
              seamless, personalized, and enjoyable experience for our
              customers. We aim to offer the best products at competitive prices
              while prioritizing customer satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            We envision a world where shopping is accessible, convenient, and
            inspiring. Through innovation and dedication, we strive to be a
            leader in the e-commerce industry, empowering our customers with
            quality and choice.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Meet the Team
        </h2>
        <p className="mt-4 text-gray-600 text-center leading-relaxed">
          Behind every great product is a team of dedicated professionals.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 1"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-bold text-gray-800">John Doe</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          {/* Team Member 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 2"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-bold text-gray-800">Jane Smith</h3>
            <p className="text-gray-600">Head of Operations</p>
          </div>
          {/* Team Member 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member 3"
              className="w-24 h-24 mx-auto rounded-full"
            />
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              Noel Victor
            </h3>
            <p className="text-gray-600">Lead Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
