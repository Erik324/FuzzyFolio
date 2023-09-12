import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

function DeleteAccount({ userId }) {
  const { token, logout } = useToken();
  const navigate = useNavigate();

  const deleteAccount = async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/accounts/${userId}`;
    const fetchConfig = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(url, fetchConfig);
      if (response.ok) {
        logout();
        navigate("/");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error deleting account: ", error);
    }
  };

  return (
    <button className="btn btn-outline-danger mx-3" onClick={deleteAccount}>
      Delete Account
    </button>
  );
}
export default DeleteAccount;
