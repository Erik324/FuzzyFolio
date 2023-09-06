import React, { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EventNoteIcon from "@mui/icons-material/EventNote";

function DonationList() {
  const [donations, setDonations] = useState([]);
  async function getDonations() {
    const url = `${process.env.REACT_APP_API_HOST}/api/donations`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setDonations(data.donations);
    //   console.log(donations);
    }
  }


  useEffect(() => {
    getDonations();
  }, []);

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
        {donationColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="row">
            {column.map((donation) => (
              <div key={donation.id} className="col-lg-4">
                <div className="card mb-3 p-3">
                  <img
                    src={donation.picture}
                    alt={donation.item_name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{donation.item_name}</h5>
                    <p className="card-text">{donation.description}</p>
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
