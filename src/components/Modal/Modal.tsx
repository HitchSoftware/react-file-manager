// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/Modal/Modal.tsx

import React, { useEffect, useRef, ReactNode } from "react";
import { MdClose } from "react-icons/md";
import "./Modal.scss";

interface ModalProps {
  children?: ReactNode;
  show: boolean;
  setShow: (show: boolean) => void;
  heading?: string;
  dialogWidth?: string;
  contentClassName?: string;
  closeButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  children,
  show,
  setShow,
  heading,
  dialogWidth = "25%",
  contentClassName = "",
  closeButton = true,
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      setShow(false);
    }
  };

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (show) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [show]);

  return (
    <dialog
      ref={modalRef}
      className={`fm-modal dialog`}
      style={{ width: dialogWidth }}
      onKeyDown={handleKeyDown}
    >
      <div className="fm-modal-header">
        <span className="fm-modal-heading">{heading}</span>
        {closeButton && (
          <MdClose size={18} onClick={() => setShow(false)} className="close-icon" title="Close" />
        )}
      </div>
      <div className={contentClassName}>{children}</div>
    </dialog>
  );
};

export default Modal;
