import React, { useState, useEffect } from "react";

function DonationList() {
  const [donations, setDonations] = useState([]);
  async function getDonations() {
    const url = `${process.env.REACT_APP_API_HOST}/api/donations`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setDonations(data.donations);
      console.log(donations);
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
    <div className="donation-list mt-5 pt-5">
      <div className="container">
        {donationColumns.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="row">
            {column.map((donation) => (
              <div key={`donation-${donation.id}`} className="col-md-4">
                <div className="card mb-3 p-3">
                  <div className="card-body">
                    <h5 className="card-title">{donation.item_name}</h5>
                    <p className="card-text">{donation.description}</p>
                    <p className="card-text">Date: {donation.date}</p>
                    <img
                      src={donation.picture}
                      alt={donation.item_name}
                      style={{ width: "200px", height: "200px" }}
                      className="card-img-top"
                    />
                    <p className="card-text">Category: {donation.category}</p>
                    <p className="card-text">
                      Claimed: {donation.claimed ? "Yes" : "No"}
                    </p>
                    <div className="owner-info">
                      <p>Owner:</p>
                      <p>Username: {donation.owner.username}</p>
                      <p>Phone: {donation.owner.phone}</p>
                      <p>Zip: {donation.owner.zip}</p>
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
