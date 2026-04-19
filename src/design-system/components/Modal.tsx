import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

/**
 * Reusable Modal component with backdrop, close button, and focus trap
 * Uses Framer Motion for smooth animations and React Portal for proper stacking
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }

      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);

  // Focus first interactive element when modal opens
  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeOnOutsideClick ? onClose : undefined}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden flex flex-col`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-border">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-text-primary"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    ref={initialFocusRef}
                    onClick={onClose}
                    className="text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-burnt-orange rounded-full p-1"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <div className="p-4 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at the end of the document body
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

Modal.displayName = 'Modal';

export default Modal;
---