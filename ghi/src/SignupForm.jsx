import { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";
import animationData from "./signupAnimation.json";
import { Player } from "@lottiefiles/react-lottie-player";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const { register } = useToken();
  const navigate = useNavigate();

  const handleRegistration = (e) => {
    e.preventDefault();
    const accountData = {
      first_name: firstname,
      last_name: lastname,
      username: username,
      phone: phone,
      zip: zip,
      password: password,
    };
    register(accountData, `${process.env.REACT_APP_API_HOST}/api/accounts`);
    e.target.reset();
    navigate("/");
  };

  return (
    <div className="limiter login-signup-form">
      <div className="container-login100">
        <div className="wrap-signup100">
          <div className="login100-pic js-tilt">
            <Player src={animationData} loop autoplay />
          </div>

          <form
            onSubmit={(e) => handleRegistration(e)}
            className="login100-form"
          >
            <span className="signup100-form-title">Member Signup</span>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                name="username"
                placeholder="Username(email)"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                name="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                name="firstname"
                placeholder="First name"
                onChange={(e) => {
                  setFirstname(e.target.value);
                }}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="text"
                name="lastname"
                placeholder="Last name"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="number"
                name="phone"
                placeholder="Phone number"
                minLength="10"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="wrap-input100">
              <input
                className="input100"
                type="number"
                name="zipcode"
                placeholder="Zipcode"
                minLength="5"
                onChange={(e) => {
                  setZip(e.target.value);
                }}
              />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn">Sign up</button>
            </div>

            <div className="text-center p-t-136">
              <a
                href="https://fuzzyfolio.gitlab.io/fuzzy-folio/login"
                className="txt2"
              >
                Already have an account? Login
                <i
                  className="fa fa-long-arrow-right m-l-5"
                  aria-hidden="true"
                ></i>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
