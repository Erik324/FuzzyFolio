import useToken from "@galvanize-inc/jwtdown-for-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PetDetail({ userId }) {
  const { token, fetchWithToken } = useToken();
  const [pet, setPet] = useState([]);
  const { petId } = useParams();
  // const [editPetId, setEditPetId] = useState(null);
  const navigate = useNavigate();

  const getOnePet = async () => {
    if (token) {
      const getPetUrl = `${process.env.REACT_APP_API_HOST}/api/pets/${petId}`;
      const response = await fetchWithToken(getPetUrl, "GET");
      console.log("response", response);
      setPet(response);
    }
  };

  function handleEditPet(event) {
    event.preventDefault();
    navigate(`/pets/${petId}/edit`);
  }

  function handleAddVaccine(event) {
    event.preventDefault();
    navigate(`/pets/${petId}/addVaccine`);
  }

  useEffect(() => {
    getOnePet();
  }, [token, petId]);

  return (
    // {
    // token && (
    <div className="px-4 py-5 my-5 d-flex align-items-center justify-content-center">
      <div className="card" style={{ width: "27em" }}>
        <div className="shadow p-4 mt-4">
          <img
            className="card-img-top"
            src={pet.picture}
            alt="card pet picture"
          ></img>
          <div className="card-body">
            <h5 className="card-title">{pet.pet_name}</h5>
            <ul className="card-text">Age: {pet.age}</ul>
            <ul className="card-text">Spieces: {pet.species}</ul>
            <ul className="card-text">Breed: {pet.breed}</ul>
            <ul className="card-text">Color: {pet.color}</ul>
            <ul className="card-text">Weight: {pet.weight}</ul>
            <ul className="card-text">Disease: {pet.disease}</ul>
            <ul className="card-text">Medication: {pet.medication}</ul>
            <ul className="card-text">Allergy: {pet.allergy}</ul>
            <ul className="card-text">
              Dietary Restriction: {pet.dietary_restriction}
            </ul>
            <ul className="card-text">Description: {pet.description}</ul>
            <div className="d-flex justify-content-start align-items-end">
              <button
                onClick={handleAddVaccine}
                type="button"
                className="btn btn-success"
              >
                Add Vaccine
              </button>
            </div>
            <div className="d-flex justify-content-end">
              <button
                onClick={handleEditPet}
                type="button"
                className="btn btn-primary"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetail;
