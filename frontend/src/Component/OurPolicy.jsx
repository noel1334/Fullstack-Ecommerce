import { FaExchangeAlt, FaHeadphonesAlt } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md-text-base text-gray-700">
      <div>
        <FiRefreshCcw className="w-12 m-auto mb-5" size={40} />
        <p className="text-gray-400">We Offer hassle free exchange policy</p>
      </div>
      <div>
        <FaExchangeAlt className="w-12 m-auto mb-5" size={40} />

        <p className="text-gray-400">7 days return policy</p>
      </div>
      <div>
        <FaHeadphonesAlt className="w-12 m-auto mb-5" size={40} />
        <p className="text-gray-400">Best Customer support</p>
      </div>
    </div>
  );
};

export default OurPolicy;
