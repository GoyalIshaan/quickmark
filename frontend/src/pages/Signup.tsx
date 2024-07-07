import { Navigate } from "react-router-dom";
import Quote from "../components/Quote";
import SignUpAuth from "../components/SignUpAuth";

const Signup = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/blogs" replace />;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <SignUpAuth />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

export default Signup;
