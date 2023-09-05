import React, { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate, useParams } from "react-router-dom";

function VaccineForm() {
  const { token, fetchWithToken } = useToken();
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
        received_date: receivedDate,
        due_date: dueDate,
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
    <div className="row px-4 py-5 my-5 text-center">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
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
              <label htmlFor="itemName">Vaccine Name</label>
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
                id="receievedDate"
                className="form-control"
              />
              <label htmlFor="date">Received Date</label>
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
            <button className="btn btn-primary">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default VaccineForm;
