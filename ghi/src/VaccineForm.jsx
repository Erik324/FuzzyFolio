import React, { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate, useParams } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import animation from "./CatVacAnimation.json";

function VaccineForm() {
  const { token } = useToken();
  const [vaccineName, setVaccineName] = useState("");
  const [clinic, setClinic] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { petId } = useParams();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/vaccines`;
    const fetchConfig = {
      method: "POST",
      body: JSON.stringify({
        vaccine_name: vaccineName,
        clinic: clinic,
        received_date: receivedDate ? receivedDate : null,
        due_date: dueDate ? dueDate : null,
        pet_id: petId,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      setVaccineName("");
      setClinic("");
      setReceivedDate("");
      setDueDate("");
      navigate(`/pets/${petId}`);
    } else {
      console.log(response);
    }
  }

  const handleVaccineNameChange = (event) => {
    setVaccineName(event.target.value);
  };

  const handleClinicChange = (event) => {
    setClinic(event.target.value);
  };

  function handleReceivedDateChange(event) {
    const selectedDate = event.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
    setReceivedDate(formattedDate);
  }

  function handleDueDateChange(event) {
    const selectedDate = event.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
    setDueDate(formattedDate);
  }
  return (
    <div className="min-vh-100 pt-3 vaccine-background">
      <div className="container">
        <div className="row mx-5" id="row-margin">
          {/* <div className="row justify-content-center align-items-center vh-100"> */}
          <div className="col-lg-6 mx-auto my-auto" id="vax-form">
            <div className="shadow p-4 mt-4 vac-form-bg">
              <h1>Add A Vaccine</h1>
              <form onSubmit={handleSubmit} id="create-vaccine-form">
                <div className="form-floating mb-3">
                  <input
                    onChange={handleVaccineNameChange}
                    value={vaccineName}
                    placeholder="vaccine name"
                    required
                    type="text"
                    name="vaccineName"
                    id="vaccineName"
                    className="form-control"
                  />
                  <label htmlFor="vaccineName">Vaccine Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    onChange={handleClinicChange}
                    value={clinic}
                    placeholder="Clinic"
                    type="text"
                    name="clinic"
                    id="clinic"
                    className="form-control"
                  />
                  <label htmlFor="clinic">Clinic</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    onChange={handleReceivedDateChange}
                    value={receivedDate}
                    placeholder="received date"
                    type="date"
                    name="receivedDate"
                    id="receivedDate"
                    className="form-control"
                  />
                  <label htmlFor="receivedDate">Received Date</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    onChange={handleDueDateChange}
                    value={dueDate}
                    placeholder="due date"
                    type="date"
                    name="dueDate"
                    id="dueDate"
                    className="form-control"
                  />
                  <label htmlFor="dueDate">Due Date</label>
                </div>
                <button className="btn btn-info">Add</button>
              </form>
            </div>
          </div>
          <div className="col" id="cat-anim">
            <Player src={animation} loop autoplay />
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
export default VaccineForm;
