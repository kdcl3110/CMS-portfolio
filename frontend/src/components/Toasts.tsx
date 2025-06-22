import React from "react";
import { ToastContainer, ToastOptions, toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

const toastOPtion: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export const showSucces = (message: string): void => {
  toast.success(message, toastOPtion);
};

export const showError = (message: string) : void => {
  toast.error(message, toastOPtion);
};

export const showWarning = (message: string): void => {
  toast.warning(message, toastOPtion);
};

export const show = (message: string) : void => {
  toast(message, toastOPtion);
};

const Toasts : React.FC = () => (
  <ToastContainer
   position="bottom-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export default Toasts;
