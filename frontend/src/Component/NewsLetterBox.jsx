import React from "react";

const NewsLetterBox = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };
  return (
    <div className="text-center">
      <p className="text-3xl font-medium text-gray-800">
        Subscribed now to get 20% 0ff
      </p>
      <p className="text-gray-400 mt-3">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis,
        dolores natus ut aliquid odit neque obcaecati ipsum autem culpa cum!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          name="email"
          placeholder="enter your email"
          required
        />
        <button
          className="rounded-full bg-black hover:bg-slate-800  text-slate-400 text-xs px-10 py-4"
          type="submit"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
