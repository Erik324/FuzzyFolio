import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

const TitleBar = () => {
  const { logout, token } = useToken();
  const navigate = useNavigate();
  const handleClick = () => navigate("/signup");

  const logoutButton = <button onClick={logout}>Logout</button>;

  const signupButton = <button onClick={handleClick}>Signup</button>;

  return (
    <div className="mt-3">
      <span className="d-flex">
        <h1 className="flex-fill">Login Page</h1>
        <div className="btn-toolbar" role="toolbar">
          <div className="btn-group mb-3" role="group">
            {token && logoutButton}
            {!token && signupButton}
          </div>
        </div>
      </span>
    </div>
  );
};

export default TitleBar;
