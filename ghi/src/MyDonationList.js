import React, { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";


function MyDonationList({ accountId }) {
  const { token, fetchWithToken } = useToken();
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
      // console.log("accountdata:", accountData["id"]);
      // console.log("accountId:", accountId);
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
  }, [token, accountId]);


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

export default MyDonationList;
