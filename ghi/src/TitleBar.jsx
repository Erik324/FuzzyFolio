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
      My Account
    </NavLink>
  );

  const logoutButton = <button onClick={logout}>Logout</button>;
  const loginButton = <button onClick={handleLoginClick}>Login</button>;
  const signupButton = <button onClick={handleClick}>Signup</button>;
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
                <NavLink className="nav-link active" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">{token && myAccountButton}</li>
              <li className="nav-item">
                {token && logoutButton}
                {!token && signupButton}
              </li>
              <li className="nav-item">{!token && loginButton}</li>
              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink className="dropdown-item" to="/pets/new">
                      Add a Pet
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="#">
                      Another action
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/donations">
                      Donation List
                    </NavLink>
                  </li>
                  {token && (
                    <>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/donations/createDonation"
                        >
                          Create Donation
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/mydonations">
                          My Donations
                        </NavLink>
                      </li>
                    </>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="#">
                      Something else here
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
            <form className="d-flex mt-3" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
