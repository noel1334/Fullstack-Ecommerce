import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col  justify-center items-center h-full">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        <h1>Please wait...</h1>
      </div>
    </div>
  );
};

export default Loading;
