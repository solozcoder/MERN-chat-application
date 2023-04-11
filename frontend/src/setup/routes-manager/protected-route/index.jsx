import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../../pages/hooks/user-hooks";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  console.log(user);
  if (!user) {
    return <Navigate to="/authentication" />;
  }

  return children;
};

export default ProtectedRoute;
