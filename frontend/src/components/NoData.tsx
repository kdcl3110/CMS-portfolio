import React from "react";
import FolderOffIcon from "@mui/icons-material/FolderOff";

interface LoadingProps {
  show: boolean;
}

const NoData: React.FC<LoadingProps> = ({ show = false }) => {
  return (
    show && (
      <div className="p-5 text-gray-500 flex flex-col items-center justify-center w-full">
        <FolderOffIcon />
        <div>No data ...</div>
      </div>
    )
  );
};

export default NoData;
