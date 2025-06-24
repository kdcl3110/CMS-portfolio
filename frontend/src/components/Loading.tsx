import React from "react";
import loadImg from "/images/load.gif";

interface LoadingProps {
  load?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ load = false }) => {
  return load ? (
    <div className="z-50 absolute top-0 left-0 right-0 bottom-0 h-screen flex justify-center items-center bg-black/[0.5]">
      <div className="w-58 h-58 p-5 rounded-lg flex flex-col items-center justify-center">
        <img src={loadImg} className="h-48" />
      </div>
    </div>
  ) : null;
};

export default Loading;
