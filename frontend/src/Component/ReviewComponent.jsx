import React, { useState } from "react";

const ReviewComponent = ({ orderId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const handleRatingChange = (rate) => {
    setRating(rate);
  };

  const handleSubmitReview = () => {
    console.log(`Review for Order ${orderId}`);
    console.log(`Rating: ${rating}`);
    console.log(`Review: ${reviewText}`);

    // Add your API call to submit the review here

    // Show the thank you message after submission
    setShowThankYou(true);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!showThankYou ? (
          <>
            <h2 className="text-xl font-bold mb-4">Rate Your Product</h2>

            {/* Rating Stars */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={star <= rating ? "yellow" : "gray"}
                  viewBox="0 0 24 24"
                  width="30"
                  height="30"
                  onClick={() => handleRatingChange(star)}
                  className="cursor-pointer hover:scale-110 transition-all"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.215-6.024 5.875 1.421 8.32-7.397-3.891-7.398 3.891 1.42-8.32-6.024-5.875 8.333-1.215z" />
                </svg>
              ))}
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label htmlFor="review" className="block font-bold mb-1">
                Your Review
              </label>
              <textarea
                id="review"
                className="w-full p-2 border rounded"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your thoughts here..."
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSubmitReview}
                disabled={rating === 0 || !reviewText}
              >
                Submit Review
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-green-500">
              Thank You!
            </h2>
            <p className="text-lg mb-4">
              Your review has been submitted successfully.
            </p>
            <p className="text-sm text-gray-600">
              We appreciate your feedback and are happy you enjoyed your order!
            </p>
            <div className="flex justify-center mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
