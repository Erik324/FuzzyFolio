import useToken from "@galvanize-inc/jwtdown-for-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DeleteVaccine from "./DeleteVaccine";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import animalsImg from "./animals.jpg";

function PetDetail() {
  const { token, fetchWithToken } = useToken();
  const [pet, setPet] = useState([]);
  const { petId } = useParams();
  const navigate = useNavigate();
  const [vaccines, setVaccines] = useState([]);

  const getOnePet = async () => {
    if (token) {
      const getPetUrl = `${process.env.REACT_APP_API_HOST}/api/pets/${petId}`;
      const response = await fetchWithToken(getPetUrl, "GET");
      console.log("response", response);
      setPet(response);
    }
  };

  function handleEditPet(event) {
    // event.preventDefault();

    navigate(`/pets/${petId}/edit`);
    window.scrollTo(0, 0);
  }

  const getVaccinesForPet = async () => {
    if (token) {
      const getVaccinesUrl = `${process.env.REACT_APP_API_HOST}/api/vaccines`;
      const response = await fetchWithToken(getVaccinesUrl, "GET");
      const filteredVaccines = response.vaccines.filter(
        (vaccine) => vaccine.pet_id === parseInt(petId)
      );
      setVaccines(filteredVaccines);
    }
  };

  function handleAddVaccine(event) {
    event.preventDefault();
    navigate(`/pets/${petId}/addVaccine`);
  }

  function handleEditVaccine(vaccineId) {
    navigate(`/pets/${petId}/editVaccine/${vaccineId}`);
  }

  const handleDeletePet = async (petId) => {
    const deletePetUrl = `${process.env.REACT_APP_API_HOST}/api/pets/${petId}`;
    const response = await fetch(deletePetUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log("Pet has been deleted");
      navigate("/pets");
    } else {
      console.error("Failed to delete pet.");
    }
  };

  useEffect(() => {
    getOnePet();
    getVaccinesForPet();
  }, [token, petId]); // eslint-disable-line

  const renderAlertIcon = (vaccine) => {
    const dueDate = new Date(vaccine.due_date);
    const currentDate = new Date();
    const isDueDatePassed = dueDate < currentDate;

    return isDueDatePassed ? (
      <div>
        <NotificationsActiveIcon style={{ fontSize: 18, color: "red" }} />
        <span style={{ color: "red" }}>This vaccine is past due!</span>
      </div>
    ) : null;
  };

  return (
    <section id="section-1">
      <div className="px-4 py-5 my-5 d-flex align-items-center justify-content-center">
        <div className="container">
          {token && (
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="card" style={{ width: "37em" }}>
                  <div className="shadow p-4 mt-4">
                    <img
                      className="card-img-top"
                      src={pet.picture ? pet.picture : animalsImg}
                      alt="pet"
                      onError={(e) => {
                        e.target.src = animalsImg;
                      }}
                    ></img>
                    <div className="card-body">
                      <h5 className="card-title">{pet.pet_name}</h5>
                      <ul className="card-text">Age: {pet.age}</ul>
                      <ul className="card-text">Spieces: {pet.species}</ul>
                      <ul className="card-text">Breed: {pet.breed}</ul>
                      <ul className="card-text">Color: {pet.color}</ul>
                      <ul className="card-text">Weight: {pet.weight}</ul>
                      <ul className="card-text">Disease: {pet.disease}</ul>
                      <ul className="card-text">
                        Medication: {pet.medication}
                      </ul>
                      <ul className="card-text">Allergy: {pet.allergy}</ul>
                      <ul className="card-text">
                        Dietary Restriction: {pet.dietary_restriction}
                      </ul>
                      <ul className="card-text">
                        Description: {pet.description}
                      </ul>
                      <div className="d-flex flex-column">
                        <button
                          onClick={handleEditPet}
                          type="button"
                          className="btn btn-primary mb-2"
                        >
                          Edit Pet
                        </button>
                        <button
                          onClick={() => handleDeletePet(pet.id)}
                          type="button"
                          className="btn btn-outline-danger mb-2"
                        >
                          Delete Pet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card" style={{ width: "37em" }}>
                    <div className="card-body">
                      <h5 className="card-title">Vaccines</h5>
                      <ul>
                        {vaccines.map((vaccine) => (
                          <div key={vaccine.id} className="vaccine-record">
                            <p>Vaccine Name: {vaccine.vaccine_name}</p>
                            <p>Clinic: {vaccine.clinic}</p>
                            <p>Received Date: {vaccine.received_date}</p>
                            <p>Due Date: {vaccine.due_date}</p>
                            {renderAlertIcon(vaccine)}
                            <div className="text-right">
                              <button
                                onClick={() => handleEditVaccine(vaccine.id)}
                                type="button"
                                className="btn btn-primary mb-2"
                              >
                                Edit Vaccine
                              </button>
                            </div>
                            <div className="text-right">
                              <DeleteVaccine vaccineId={vaccine.id} />
                            </div>
                          </div>
                        ))}
                      </ul>
                      <div className="d-flex flex-column">
                        <button
                          onClick={handleAddVaccine}
                          type="button"
                          className="btn btn-success mb-2"
                        >
                          Add Vaccine
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="air air1"></div>
        <div className="air air2"></div>
        <div className="air air3"></div>
        <div className="air air4"></div>
      </div>
    </section>
  );
}

export default PetDetail;
