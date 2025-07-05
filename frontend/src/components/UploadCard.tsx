import React, { useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import clsx from "clsx";

interface UploadCardProps {
  width?: string; // ex: w-28, w-40
  height?: string; // ex: h-28, h-40
  onFileSelect: (file: File | null) => any;
  url?: string | null; // Optional URL for displaying an image
}

const UploadCard: React.FC<UploadCardProps> = ({
  width = "w-28",
  height = "h-28",
  onFileSelect,
  url = null,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(url);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // Empêche l'ouverture du file picker
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileSelect(null);
  };

  return (
    <div
      className={clsx(
        width,
        height,
        "cursor-pointer border-2 border-dashed border-gray-300 rounded-xl flex justify-center items-center overflow-hidden relative group transition"
      )}
      onClick={handleClick}
    >
      {preview != null && preview != "" ? (
        <>
          <img
            src={preview}
            alt="upload"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <EditIcon className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
            title="Supprimer l'image"
          >
            <CloseIcon className="w-4 h-4 text-red-500" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-700">
          <AddIcon className="w-6 h-6" />
          <span className="text-sm font-medium mt-1">Upload</span>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
        accept="image/*"
      />
    </div>
  );
};

export default UploadCard;
