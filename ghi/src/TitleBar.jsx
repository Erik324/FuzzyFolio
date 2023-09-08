import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Nav() {
  const { logout, token } = useToken();
  const navigate = useNavigate();
  const handleClick = () => navigate("/signup");
  const handleLoginClick = () => navigate("/login");

  const myAccountButton = (
    <NavLink className="nav-link" to="/myaccount">
      Account Details
    </NavLink>
  );

  const logoutButton = (
    <button className="nav-link" onClick={logout}>
      Logout
    </button>
  );
  const loginButton = (
    <button className="nav-link" onClick={handleLoginClick}>
      Login
    </button>
  );
  const signupButton = (
    <button className="nav-link" onClick={handleClick}>
      Signup
    </button>
  );
  return (
    <nav
      className="navbar navbar-light bg-body-tertiary fixed-top "
      style={{ backgroundColor: "#FFEBE6" }}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          FuzzyFolio
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <i className="navbar-toggler-icon"></i>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              FuzzyFolio
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">{!token && signupButton}</li>
              <li className="nav-item">{!token && loginButton}</li>
              {token && (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      My Account
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        {token && myAccountButton}
                      </li>

                      <li className="dropdown-item">
                        <NavLink className="nav-link" to="/pets/new">
                          Add a Pet
                        </NavLink>
                      </li>

                      <li className="dropdown-item">
                        <NavLink className="nav-link" to="/pets">
                          My Pets
                        </NavLink>
                      </li>
                      <li className="dropdown-item">
                        <NavLink
                          className="nav-link"
                          to="/donations/createDonation"
                        >
                          Create Donation
                        </NavLink>
                      </li>
                      <li className="dropdown-item">
                        <NavLink className="nav-link" to="/mydonations">
                          My Donations
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/donations">
                  Donation List
                </NavLink>
              </li>
              <li className="nav-item">{token && logoutButton}</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
