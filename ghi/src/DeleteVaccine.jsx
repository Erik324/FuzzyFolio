import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate, useParams } from "react-router-dom";

function DeleteVaccine({ vaccineId }) {
  const { token } = useToken();
  const navigate = useNavigate();
  const { petId } = useParams();

  const deleteVaccine = async () => {
    console.log("vaccineId: ", vaccineId);
    const url = `${process.env.REACT_APP_API_HOST}/api/vaccines/${vaccineId}`;
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
        console.log("Vaccine has been deleted");
        navigate(`/pets`);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error deleting account: ", error);
    }
  };

  return (
    <button className="btn btn-outline-danger mx-3" onClick={deleteVaccine}>
      Delete Vaccine
    </button>
  );
}
export default DeleteVaccine;
