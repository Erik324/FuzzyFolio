import React, { useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";

function DonationForm({ accountId }) {
  const { token, fetchWithToken } = useToken();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [picture, setPicture] = useState("");
  const [category, setCategory] = useState("");
  const [claimed, setClaimed] = useState("");

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

  async function handleSubmit(event) {
    event.preventDefault();
    // if (!token) {
    //   console.log("Please log in to create a donation.");
    //   return;
    // }
    // console.log(token);

    // const accountUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${accountId}`;
    // const accountData = await fetchWithToken(accountUrl, "GET");
    // if (accountData["id"] !== accountId) {
    //   console.log(
    //     "You are not authorized to create a donation for this account."
    //   );
    //   return;
    // }

    const data = {
      item_name: itemName,
      description,
      date,
      picture,
      category,
      claimed: Boolean(claimed),
      owner_id: accountId,
    };

    const donationUrl = `${process.env.REACT_APP_API_HOST}/api/donations`;
    const response = await fetch(donationUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      //   const newDonation = await response.json();
      //   console.log(newDonation);

      setItemName("");
      setDescription("");
      setDate("");
      setPicture("");
      setCategory("");
      setClaimed("");
    }
  }

  return (
    <div className="row px-4 py-5 my-5 text-center">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1>Create a donation post</h1>
          <form onSubmit={handleSubmit} id="create-donation-form">
            <div className="form-floating mb-3">
              <input
                onChange={handleItemNameChange}
                value={itemName}
                placeholder="item name"
                required
                type="text"
                name="itemName"
                id="itemName"
                className="form-control"
              />
              <label htmlFor="itemName">Item Name</label>
            </div>
            <div className="form-floating mb-3">
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
              <label htmlFor="description">Description</label>
            </div>
            <div className="form-floating mb-3">
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
              <label htmlFor="date">Date</label>
            </div>
            <div className="form-floating mb-3">
              <input
                onChange={handlePictureChange}
                value={picture}
                placeholder="Picture url"
                type="text"
                name="picture"
                id="picture"
                className="form-control"
              />
              <label htmlFor="picture">Picture</label>
            </div>
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
            <div className="form-check mb-3">
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
            <button className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DonationForm;
