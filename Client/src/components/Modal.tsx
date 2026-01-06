import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="modal-body mb-4">{children}</div>
        {footerContent && (
          <div className="modal-footer border-t pt-3 mt-4 flex justify-end space-x-2">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
