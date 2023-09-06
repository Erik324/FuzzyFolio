import React, { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditMyVaccine() {
  const { fetchWithToken, token } = useToken();
  const [vaccineName, setVaccineName] = useState("");
  const [clinic, setClinic] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { petId } = useParams();
  const { vaccineId } = useParams();
  const navigate = useNavigate();
  const [vaccines, setVaccines] = useState("");

  function handleVaccineNameChange(event) {
    const { value } = event.target;
    setVaccineName(value);
  }

  function handleClinicChange(event) {
    const { value } = event.target;
    setClinic(value);
  }

  function handleReceivedDateChange(event) {
    const unformattedReceivedDate = event.target.value;
    const formattedReceivedDate = new Date(unformattedReceivedDate)
      .toISOString()
      .split("T")[0];
    setReceivedDate(formattedReceivedDate);
  }

  function handleDueDate(event) {
    const unformattedDueDate = event.target.value;
    const formattedDueDate = new Date(unformattedDueDate)
      .toISOString()
      .split("T")[0];
    setDueDate(formattedDueDate);
  }

  const fetchVaccineData = async () => {
    if (token) {
      const vaccineUrl = `${process.env.REACT_APP_API_HOST}/api/vaccines/${vaccineId}`;
      const response = await fetchWithToken(vaccineUrl, "GET");

      //   console.log("vaccine response", response);

      setVaccineName(response.vaccine_name);
      setClinic(response.clinic);
      setReceivedDate(response.received_date);
      setDueDate(response.due_date);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      vaccine_name: vaccineName,
      clinic,
      received_date: receivedDate,
      due_date: dueDate,
      pet_id: petId,
    };

    const vaccineUrl = `${process.env.REACT_APP_API_HOST}/api/vaccines/${vaccineId}`;
    const response = await fetch(vaccineUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      navigate(`/pets/${petId}`);
    }
  }

  useEffect(() => {
    fetchVaccineData();
  }, [token, petId]);

  return (
    <div className="row px-4 py-5 my-5 text-center">
      <div className="offset-3 col-6">
        {token && (
          <div className="shadow p-4 mt-4">
            <h1>Edit Vaccine</h1>
            <form onSubmit={handleSubmit} id="edit-donation-form">
              <div className="form-floating mb-3">
                <input
                  onChange={handleVaccineNameChange}
                  value={vaccineName}
                  placeholder="Rabies Vaccine, Heartworm, and Tick Diseases etc"
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
                  value={clinic || ""}
                  placeholder="Clinic Name"
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
                  value={receivedDate || ""}
                  placeholder="Recevied Date"
                  type="date"
                  name="receivedDate"
                  id="receivedDate"
                  className="form-control"
                />
                <label htmlFor="receivedDate">Received Date</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  onChange={handleDueDate}
                  value={dueDate || ""}
                  placeholder="Due Date"
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  className="form-control"
                />
                <label htmlFor="dueDate">Due Date</label>
              </div>
              <button className="btn btn-primary">Update</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditMyVaccine;
