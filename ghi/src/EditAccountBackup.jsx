import useToken from "@galvanize-inc/jwtdown-for-react";
import { useEffect, useState } from "react";

function EditAccount({ userId }) {
  const { fetchWithToken, token } = useToken();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [username, setUsername] = useState("");
  const [account, setAccount] = useState({});
  const [load, setLoad] = useState("");

  async function getAccountDetails() {
    if (token) {
      const url = `${process.env.REACT_APP_API_HOST}/api/accounts/${userId}`;
      const response = await fetchWithToken(url, "get");
      setAccount(response);
    }
  }
  function setFormValues() {
    setFirstName(account.first_name);
    setLastName(account.last_name);
    setUsername(account.username);
    setPhone(account.phone);
    setZip(account.zip);
    setLoad("True");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      address,
    };

    const url = "http://localhost:8090/api/customers/";
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      const newCustomer = await response.json();
      console.log(newCustomer);
      setAddress("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
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
    setAddress(value);
  }

  function handlePhoneChange(event) {
    const { value } = event.target;
    setPhoneNumber(value);
  }
  function handleButton(event) {
    event.preventDefault();
    setLoad("");
  }

  useEffect(() => {
    getAccountDetails();
  }, [userId]);

  useEffect(() => {
    setFormValues();
  }, [account]);

  const formView = (
    <div className="px-4 py-5 my-5 text-center">
      <div className="row">
        <div className="col"></div>
        <div className="col-4">
          <form className="card shadow p-4 mx-md-4">
            <h1>Edit Account</h1>
            {/* <!-- 2 column grid layout with text inputs htmlFor the first and last names --> */}
            <div className="row mb-4">
              <div className="col">
                <div className="form-outline">
                  <input
                    type="text"
                    id="first_name"
                    className="form-control"
                    value={firstName}
                    placeholder={firstName}
                    onChange={handleFirstNameChange}
                  />
                  <label className="form-label" htmlFor="first_name">
                    First name
                  </label>
                </div>
              </div>
              <div className="col">
                <div className="form-outline">
                  <input
                    type="text"
                    id="last_name"
                    className="form-control"
                    value={lastName}
                    placeholder={lastName}
                    onChange={handleLastNameChange}
                  />
                  <label className="form-label" htmlFor="last_name">
                    Last name
                  </label>
                </div>
              </div>
            </div>

            {/* <!-- Text input --> */}
            <div className="form-outline mb-4">
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={handleUsernameChange}
              />
              <label className="form-label" htmlFor="username">
                Username
              </label>
            </div>

            {/* <!-- Text input --> */}
            <div className="form-outline mb-4">
              <input
                type="text"
                id="phone"
                className="form-control"
                value={phone}
              />
              <label className="form-label" htmlFor="phone">
                Phone
              </label>
            </div>

            {/* <!-- Email input --> */}
            <div className="form-outline mb-4">
              <input type="email" id="form6Example5" className="form-control" />
              <label className="form-label" htmlFor="form6Example5">
                Email
              </label>
            </div>

            {/* <!-- Number input --> */}
            <div className="form-outline mb-4">
              <input
                type="number"
                id="form6Example6"
                className="form-control"
              />
              <label className="form-label" htmlFor="form6Example6">
                Phone
              </label>
            </div>

            {/* <!-- Message input --> */}
            <div className="d-none">
              <textarea className="d-none" id="form6Example7"></textarea>
              <label className="d-none" htmlFor="form6Example7">
                Additional information
              </label>
            </div>

            {/* <!-- Submit button --> */}
            <button
              type="submit"
              className="btn btn-primary btn-block mb-4"
              value={load}
              onChange={handleButton}
            >
              Place order
            </button>
          </form>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );

  return <div className="form-outline mb-4">{firstName && formView}</div>;
}

export default EditAccount;
