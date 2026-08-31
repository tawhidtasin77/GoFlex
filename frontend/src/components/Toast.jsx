import React, { useEffect, useRef, useState } from "react";

const Toast = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const startY = useRef(null);
  const currentY = useRef(null);
  const dismissed = useRef(false);

  const closeToast = () => {
    if (dismissed.current) return;

    dismissed.current = true;
    setLeaving(true);

    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 50);

    const hideTimer = setTimeout(() => {
      closeToast();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);


  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (
      startY.current === null ||
      currentY.current === null
    ) {
      return;
    }

    const swipeDistance =
      startY.current - currentY.current;

    if (swipeDistance > 50) {
      closeToast();
    }

    startY.current = null;
    currentY.current = null;
  };

  const styles = {
    success: {
      container:
        "border-emerald-500/30 bg-emerald-500 text-white",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },

    error: {
      container:
        "border-red-500/30 bg-red-500 text-white",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
          />
        </svg>
      ),
    },

    warning: {
      container:
        "border-amber-400/30 bg-amber-400 text-zinc-950",

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          />
        </svg>
      ),
    },
  };

  const currentStyle =
    styles[type] || styles.success;

  return (
    <div
      className={`fixed left-1/2 top-4 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-300 ease-out ${
        visible && !leaving
          ? "translate-y-0 opacity-100"
          : "-translate-y-16 opacity-0"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 shadow-xl shadow-black/30 ${currentStyle.container}`}
      >

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10">
          {currentStyle.icon}
        </div>


        <p className="flex-1 text-sm font-medium leading-5">
          {message}
        </p>


        <button
          type="button"
          onClick={closeToast}
          aria-label="Close notification"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-current opacity-70 transition hover:bg-black/10 hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M18 6 6 18"
            />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default Toast;