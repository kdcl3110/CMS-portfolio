import * as React from "react";
import Button from "@mui/material/Button";
import { Modal } from "./ui/modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  action?: (param?: any) => void;
  title?: string;
  description?: string;
}

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  action = () => {},
  title,
  description
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-2xl"
      showCloseButton={true}
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {description}
          </p>
        </div>

        <div className="flex flex-col">
          <div>{children}</div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="small" color="secondary" variant="contained" onClick={onClose}>
              Fermer
            </Button>
            <Button size="small" variant="contained" onClick={action}>
              Valider
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
