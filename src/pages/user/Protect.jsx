import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Protect = ({ children }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && user?.role !== "user") {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  return user?.role === "user" ? children : null;
};

export default Protect;
