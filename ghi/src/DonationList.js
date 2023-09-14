import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EventNoteIcon from "@mui/icons-material/EventNote";
import donationImage from "./donation1.png";

function DonationList() {
  const [donations, setDonations] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [claimedFilter, setClaimedFilter] = useState("all");

  async function getDonations() {
    const url = `${process.env.REACT_APP_API_HOST}/api/donations`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setDonations(data.donations);
    }
  }

  useEffect(() => {
    getDonations();
  }, []);


  const filterByCategory = (donations, category) => {
    if (category === "all") {
      return donations;
    }
    return donations.filter((donation) => donation.category === category);
  };


  const filterByClaimed = (donations, claimedStatus) => {
    if (claimedStatus === "all") {
      return donations;
    }
    return donations.filter(
      (donation) => donation.claimed === (claimedStatus === "claimed")
    );
  };

  useEffect(() => {
    async function fetchData() {
      const url = `${process.env.REACT_APP_API_HOST}/api/donations`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        let filteredDonations = data.donations;


        filteredDonations = filterByCategory(filteredDonations, categoryFilter);
        filteredDonations = filterByClaimed(filteredDonations, claimedFilter);

        setDonations(filteredDonations);
      }
    }

    fetchData();
  }, [categoryFilter, claimedFilter]);

  const createColumns = (array, columnsCount) => {
    const result = [];
    for (let i = 0; i < array.length; i += columnsCount) {
      result.push(array.slice(i, i + columnsCount));
    }
    return result;
  };

  const donationColumns = createColumns(donations, 3);


  return (
    <div className="donation-list px-4 py-5 my-5 text-center">
      <div className="container">
        <div className="filter-controls d-flex justify-content-between mb-3">
          <select
            class="form-select form-select-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="pet-toys">Pet Toys</option>
            <option value="pet-cloth">Pet Cloth</option>
            <option value="pet-food">Pet Food</option>
            <option value="pet-health">Pet Health</option>
            <option value="pet-house">Pet House</option>
            <option value="others">Others</option>
          </select>

          <select
            class="form-select form-select-sm"
            value={claimedFilter}
            onChange={(e) => setClaimedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="claimed">Claimed</option>
            <option value="unclaimed">Unclaimed</option>
          </select>
        </div>
        {donationColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="row">
            {column.map((donation) => (
              <div key={donation.id} className="col-lg-4">
                <div className="card mb-3 p-3">
                  <img
                    src={donation.picture ? donation.picture : donationImage}
                    alt={donation.item_name}
                    onError={(e) => {
                      e.target.src = donationImage;
                    }}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{donation.item_name}</h5>
                    <p className="card-text">
                      Available:
                      {donation.claimed ? (
                        <>
                          <CloseIcon style={{ fontSize: 18, color: "red" }} />
                        </>
                      ) : (
                        <>
                          <CheckIcon style={{ fontSize: 18, color: "green" }} />
                        </>
                      )}
                    </p>
                    <div className="owner-info">
                      <p>Email: {donation.owner.username}</p>
                      <p>Phone: {donation.owner.phone}</p>
                      <p>Zip: {donation.owner.zip}</p>
                      <p className="card-text">{donation.description}</p>
                    </div>
                    <div className="card-footer" id="custom-card-footer">
                      <h5>
                        <EventNoteIcon
                          style={{ fontSize: 24, color: "blue" }}
                        />
                      </h5>
                      <p
                        className="card-text"
                        id="card-created-date"
                        style={{ marginTop: "10px" }}
                      >
                        Available Date: {donation.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonationList;
