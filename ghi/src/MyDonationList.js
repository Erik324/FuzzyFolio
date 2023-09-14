import React, { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import donationImage from "./donation1.png";

function MyDonationList({ accountId }) {
  const { token, fetchWithToken } = useToken();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);

  async function getDonations() {
    const url = `${process.env.REACT_APP_API_HOST}/api/donations`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setDonations(data.donations);
    }
  }
  async function getAccountData() {
    if (token && accountId != null) {
      const accountUrl = `${process.env.REACT_APP_API_HOST}/api/accounts/${accountId}`;
      const accountData = await fetchWithToken(accountUrl, "GET");
      if (accountData["id"] !== accountId) {
        console.log(
          "You are not authorized to view donations for this account."
        );
        setIsAuthorized(false);
      }
    }
  }

  useEffect(() => {
    getDonations();
    getAccountData();
  }, [token, accountId]); // eslint-disable-line

  let donationColumns = [];
  if (isAuthorized) {
    const filteredDonations = donations.filter(
      (donation) => donation.owner.id === accountId
    );
    const createColumns = (array, columnsCount) => {
      const result = [];
      for (let i = 0; i < array.length; i += columnsCount) {
        result.push(array.slice(i, i + columnsCount));
      }
      return result;
    };
    donationColumns = createColumns(filteredDonations, 3);
  }

  const handleEditButtonClick = (donationId) => {
    navigate(`/donations/editDonation/${donationId}`);
  };

  const handleDeleteButtonClick = async (donationId) => {
    const deleteUrl = `${process.env.REACT_APP_API_HOST}/api/donations/${donationId}`;
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      getDonations();
    } else {
      console.error("Failed to delete donation.");
    }
  };

  return (
    <div className="donation-list px-4 py-5 my-5 text-center">
      <div className="container">
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
                    <div
                      className="card-footer"
                      id="my-donation-custom-card-footer"
                    >
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
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEditButtonClick(donation.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteButtonClick(donation.id)}
                      >
                        Delete
                      </button>
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

export default MyDonationList;
