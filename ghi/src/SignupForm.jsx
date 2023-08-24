import { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

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
    <div className="card text-bg-light mb-3">
      <h5 className="card-header">Signup</h5>
      <div className="card-body">
        <form onSubmit={(e) => handleRegistration(e)}>
          <div className="mb-3">
            <label className="form-label">username(email)</label>
            <input
              required
              name="username"
              type="email"
              className="form-control"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">password</label>
            <input
              required
              name="password"
              type="password"
              className="form-control"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">firstname</label>
            <input
              required
              name="firstname"
              type="text"
              className="form-control"
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">lastname</label>
            <input
              required
              name="lastname"
              type="text"
              className="form-control"
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">phone</label>
            <input
              name="phone"
              type="number"
              minLength="10"
              className="form-control"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">zip code</label>
            <input
              required
              name="zipcode"
              type="number"
              minLength="5"
              className="form-control"
              onChange={(e) => {
                setZip(e.target.value);
              }}
            />
          </div>
          <div>
            <input className="btn btn-primary" type="submit" value="Register" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
