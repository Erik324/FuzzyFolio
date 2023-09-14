import React, { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import animationData from "./EditdonationAnimation.json";
import { Player } from "@lottiefiles/react-lottie-player";


function EditMyDonation({ accountId }) {
  const { token, fetchWithToken } = useToken();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [picture, setPicture] = useState("");
  const [category, setCategory] = useState("");
  const [claimed, setClaimed] = useState("");
  const { donationId } = useParams();
  const navigate = useNavigate();

  function handleItemNameChange(event) {
    const { value } = event.target;
    setItemName(value);
  }

  function handleDescriptionChange(event) {
    const { value } = event.target;
    setDescription(value);
  }

  function handleDateChange(event) {
    const selectedDate = event.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
    setDate(formattedDate);
  }

  function handlePictureChange(event) {
    const { value } = event.target;
    setPicture(value);
  }
  function handleCategoryChange(event) {
    const { value } = event.target;
    setCategory(value);
  }
  function handleClaimedChange(event) {
    const { checked } = event.target;
    setClaimed(checked);
  }

  useEffect(() => {
    async function fetchDonationData() {
      const donationUrl = `${process.env.REACT_APP_API_HOST}/api/donations/${donationId}`;
      const response = await fetchWithToken(donationUrl, "GET");
      setItemName(response.item_name);
      setDescription(response.description);
      setDate(response.date);
      setPicture(response.picture);
      setCategory(response.category);
      setClaimed(response.claimed);
    }
    fetchDonationData();
  }, [token, donationId]); // eslint-disable-line

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      item_name: itemName,
      description,
      date,
      picture,
      category,
      claimed: Boolean(claimed),
      owner_id: accountId,
    };

    const donationUrl = `${process.env.REACT_APP_API_HOST}/api/donations/${donationId}`;
    const response = await fetch(donationUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      navigate(`/mydonations`);
    }
  }

  return (
    <div className="vh-100 donation-custom">
      <div className="container h-100 ">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-lg-10 col-xl-8 pt-3 pb-3 edit-donation-box-height">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body mt-3 mb-3 p-md-3">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1 mb-1">
                    <p className="text-center h1 fw-bold mb-3 mx-2 mx-md-3 mt-2">
                      Edit Donation
                    </p>
                    <form
                      className="mx-1 mx-md-4"
                      onSubmit={handleSubmit}
                      id="edit-donation-form"
                    >
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="itemName">Item Name</label>
                          <input
                            onChange={handleItemNameChange}
                            value={itemName}
                            placeholder="Item name"
                            required
                            type="text"
                            name="itemName"
                            id="itemName"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="description">Description</label>
                          <input
                            onChange={handleDescriptionChange}
                            value={description}
                            placeholder="Description"
                            required
                            type="text"
                            name="description"
                            id="description"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="date">Date</label>
                          <input
                            onChange={handleDateChange}
                            value={date}
                            placeholder="Date"
                            required
                            type="date"
                            name="date"
                            id="date"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <label htmlFor="picture">Picture</label>
                          <input
                            onChange={handlePictureChange}
                            value={picture}
                            placeholder="Picture URL"
                            type="text"
                            name="picture"
                            id="picture"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <div className="mb-3">
                            <select
                              value={category}
                              required
                              onChange={handleCategoryChange}
                              name="category"
                              id="category"
                              className="form-select"
                            >
                              <option value="">Choose a category</option>
                              <option value="pet-toys">Pet Toys</option>
                              <option value="pet-cloth">Pet Cloth</option>
                              <option value="pet-food">Pet Food</option>
                              <option value="pet-health">Pet Health</option>
                              <option value="pet-house">Pet House</option>
                              <option value="others">Others</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-check d-flex justify-content-center mt-2 mb-2">
                        <input
                          onChange={handleClaimedChange}
                          checked={claimed}
                          type="checkbox"
                          name="claimed"
                          id="claimed"
                          className="form-check-input"
                        />
                        <label htmlFor="claimed" className="form-check-label">
                          Is it claimed?
                        </label>
                      </div>
                      <div className="d-flex flex-column">
                        <button className="btn btn-primary btn-lg btn-block">
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                  <div
                    className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2"
                    style={{ marginBottom: "10px" }}
                  >
                    <Player
                      src={animationData}
                      loop
                      autoplay
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMyDonation;
