import useToken from "@galvanize-inc/jwtdown-for-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PetForm({ userId }) {
  const navigate = useNavigate();
  const [petName, setPetName] = useState("");
  const [picture, setPicture] = useState("");
  const [age, setAge] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");
  const [disease, setDisease] = useState("");
  const [medication, setMedication] = useState("");
  const [allergy, setAllergy] = useState("");
  const [dietaryRestriction, setDietaryRestriction] = useState("");
  const [description, setDescription] = useState("");
  const { token } = useToken();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/pets`;
    const fetchConfig = {
      method: "POST",
      body: JSON.stringify({
        pet_name: petName,
        picture: picture,
        age: age ? parseInt(age, 10) : null,
        species: species,
        breed: breed,
        color: color,
        weight: weight ? parseInt(weight, 10) : null,
        disease: disease,
        medication: medication,
        allergy: allergy,
        dietary_restriction: dietaryRestriction,
        description: description,
        owner_id: userId,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      setPetName("");
      setPicture("");
      setAge("");
      setSpecies("");
      setBreed("");
      setColor("");
      setWeight("");
      setDisease("");
      setMedication("");
      setAllergy("");
      setDietaryRestriction("");
      setDescription("");
    } else {
      console.log(response);
    }
    navigate("/");
  };

  const handlePetNameChange = (event) => {
    setPetName(event.target.value);
  };

  const handlePictureChange = (event) => {
    setPicture(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleSpeciesChange = (event) => {
    setSpecies(event.target.value);
  };

  const handleBreedChange = (event) => {
    setBreed(event.target.value);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleWeightChange = (event) => {
    setWeight(event.target.value);
  };

  const handleDiseaseChange = (event) => {
    setDisease(event.target.value);
  };

  const handleMedicationChange = (event) => {
    setMedication(event.target.value);
  };

  const handleAllergyChange = (event) => {
    setAllergy(event.target.value);
  };

  const handleDietaryRestrictionChange = (event) => {
    setDietaryRestriction(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div className="px-4 py-5 my-5">
      <div className="container" id="pf-view">
        <div className="card text-bg-light mb-3">
          <h5 className="card-header text-center">Add A Pet</h5>
          <div className="card-body">
            <form onSubmit={handleSubmit} id="create-pet-form">
              <div className="mb-3">
                <label className="form-label">Pet Name (required)</label>
                <input
                  required
                  name="pet-name"
                  id="pet-name"
                  type="text"
                  className="form-control"
                  onChange={handlePetNameChange}
                  placeholder="Name"
                  value={petName}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Picture</label>
                <input
                  name="picture"
                  id="picture"
                  type="text"
                  className="form-control"
                  onChange={handlePictureChange}
                  placeholder="picture url"
                  value={picture}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                  name="age"
                  id="age"
                  type="number"
                  className="form-control"
                  onChange={handleAgeChange}
                  value={age}
                  placeholder="0"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Species</label>
                <input
                  name="species"
                  id="species"
                  type="text"
                  className="form-control"
                  onChange={handleSpeciesChange}
                  value={species}
                  placeholder="Cat, Dog, etc."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Breed</label>
                <input
                  name="breed"
                  id="breed"
                  type="text"
                  className="form-control"
                  onChange={handleBreedChange}
                  value={breed}
                  placeholder="Pug, Poodle, etc."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Color</label>
                <input
                  name="color"
                  id="color"
                  type="text"
                  className="form-control"
                  onChange={handleColorChange}
                  value={color}
                  placeholder="White"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Weight</label>
                <input
                  name="weight"
                  id="weight"
                  type="number"
                  className="form-control"
                  onChange={handleWeightChange}
                  value={weight}
                  placeholder="In lbs"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Disease</label>
                <input
                  name="disease"
                  id="disease"
                  type="text"
                  className="form-control"
                  onChange={handleDiseaseChange}
                  value={disease}
                  placeholder="disease 1, disease 2,.."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Medication</label>
                <input
                  name="medication"
                  id="medication"
                  type="text"
                  className="form-control"
                  onChange={handleMedicationChange}
                  value={medication}
                  placeholder="med 1, med 2,.."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Allergies</label>
                <input
                  name="allergy"
                  id="allergy"
                  type="text"
                  className="form-control"
                  onChange={handleAllergyChange}
                  value={allergy}
                  placeholder="allergy 1, allergy 2,"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Dietary Restrictions</label>
                <input
                  name="dietary-restriction"
                  id="dietary-restriction"
                  type="text"
                  className="form-control"
                  onChange={handleDietaryRestrictionChange}
                  value={dietaryRestriction}
                  placeholder="restr 1, restr 2,.."
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  name="description"
                  id="description"
                  type="text"
                  className="form-control"
                  onChange={handleDescriptionChange}
                  value={description}
                  placeholder="story, behavior, other."
                />
              </div>
              <div>
                <input
                  className="btn btn-primary"
                  type="submit"
                  value="Register"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetForm;
