import { Navigate } from "react-router-dom";

const AuthenticatedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token === null) {
    return <>Not authenticate</>;
  }

  return children;
};

export default AuthenticatedRoute;
