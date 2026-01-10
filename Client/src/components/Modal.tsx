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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-800/80 border border-white/20 p-6 rounded-xl shadow-lg max-w-sm w-full relative">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="modal-body mb-4">{children}</div>
        {footerContent && (
          <div className="modal-footer border-t border-gray-700 pt-3 mt-4 flex justify-end space-x-2">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
