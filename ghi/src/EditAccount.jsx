import useToken from "@galvanize-inc/jwtdown-for-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditAccount({ userId }) {
  const { fetchWithToken, token } = useToken();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function getAccountDetails() {
    if (token) {
      const url = `${process.env.REACT_APP_API_HOST}/api/accounts/${userId}`;
      const response = await fetchWithToken(url, "get");
      setFirstName(response.first_name);
      setLastName(response.last_name);
      setUsername(response.username);
      setPhone(response.phone);
      setZip(response.zip);
    }
  }

  function handleFirstNameChange(event) {
    const { value } = event.target;
    setFirstName(value);
  }

  function handleLastNameChange(event) {
    const { value } = event.target;
    setLastName(value);
  }

  function handleUsernameChange(event) {
    const { value } = event.target;
    setUsername(value);
  }

  function handlePhoneChange(event) {
    const { value } = event.target;
    setPhone(value);
  }

  function handleZipChange(event) {
    const { value } = event.target;
    setZip(value);
  }

  async function handleButton(event) {
    event.preventDefault();
    setError(false);
    if (zip.toString().length === 5) {
      const data = {
        first_name: firstName,
        last_name: lastName,
        username,
        phone,
        zip,
      };

      const editUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${userId}`;
      const response = await fetch(editUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        navigate("/myaccount");
      }
    } else {
      setError(true);
    }
  }

  useEffect(() => {
    getAccountDetails();
  }, [userId]);

  const errorWindow = (
    <div>
      <p className="fw-bold text-danger"> **Please input 5 digits for Zip</p>
    </div>
  );

  return (
    <div className="form-outline mb-4">
      <div className="px-4 py-5 my-5 text-center">
        <div className="row">
          <div className="col"></div>
          <div className="col-4">
            <div>{error && errorWindow}</div>
            <form className="card shadow p-4 mx-md-4" onSubmit={handleButton}>
              <h1>Edit Account</h1>

              <div className="row mb-4">
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="first_name"
                      className="form-control"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      required
                    />
                    <label className="form-label" htmlFor="first_name">
                      First name
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="form-outline">
                    <input
                      required
                      type="text"
                      id="last_name"
                      className="form-control"
                      value={lastName}
                      onChange={handleLastNameChange}
                    />
                    <label className="form-label" htmlFor="last_name">
                      Last name
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-outline mb-4">
                <input
                  required
                  type="email"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <label className="form-label" htmlFor="username">
                  Username (Email)
                </label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="number"
                  minLength="10"
                  maxLength="10"
                  id="phone"
                  className="form-control"
                  value={phone}
                  onChange={handlePhoneChange}
                />
                <label className="form-label" htmlFor="phone">
                  Phone
                </label>
              </div>

              <div className="form-outline mb-4">
                <input
                  required
                  type="number"
                  id="zip"
                  className="form-control"
                  value={zip}
                  onChange={handleZipChange}
                  minLength={4}
                />
                <label className="form-label" htmlFor="zip">
                  Zip
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block mb-4">
                Update Account
              </button>
            </form>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </div>
  );
}

export default EditAccount;
