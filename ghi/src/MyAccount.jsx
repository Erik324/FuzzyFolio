import useToken from "@galvanize-inc/jwtdown-for-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";

function MyAccount({ userId }) {
  const { fetchWithToken, token } = useToken();
  const [account, setAccount] = useState({});
  const navigate = useNavigate();

  async function getAccountDetails() {
    if (token) {
      const url = `${process.env.REACT_APP_API_HOST}/api/accounts/${userId}`;
      const response = await fetchWithToken(url, "get");
      setAccount(response);
    }
  }

  function editButton(event) {
    event.preventDefault();
    navigate("/myaccount/edit");
  }

  useEffect(() => {
    getAccountDetails();
  }, [userId]); // eslint-disable-line

  const accountView = (
    <div className="row">
      <div className="col"></div>
      <div className="col-6">
        <div className="card mb-4">
          <div className="shadow card-body text-center">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
              alt="avatar"
              className="rounded-circle img-fluid"
              width="150px"
            />
            <h5 className="my-3">
              Name: {account.first_name} {account.last_name}
            </h5>
            <p className="mb-1">Username: {account.username}</p>
            <p className="mb-1">Phone: {account.phone}</p>
            <p className="mb-1">ZIP Code: {account.zip}</p>
            <div className="mt-5">
              <button
                onClick={editButton}
                type="button"
                className="btn btn-outline-primary mx-3"
              >
                Edit
              </button>
              <DeleteAccount userId={userId} />
            </div>
          </div>
        </div>
      </div>
      <div className="col"></div>
    </div>
  );

  return (
    <div className="px-4 py-5 my-5 text-center">
      <div className="container">{token && accountView}</div>
    </div>
  );
}

export default MyAccount;
