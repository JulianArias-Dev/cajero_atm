import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface InactivityHandlerProps {
  timeout?: number;
  onTimeout: () => void;
}

const InactivityHandler = ({ timeout = 60000, onTimeout }: InactivityHandlerProps) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      return;
    }

    const resetTimer = () => setLastActivity(Date.now());

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivity > timeout) {
        onTimeout();
      }
    }, 1000);

    // Escuchar eventos de actividad del usuario
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearInterval(checkInactivity);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [lastActivity, timeout, onTimeout, location.pathname]);

  return null;
};

export default InactivityHandler;
