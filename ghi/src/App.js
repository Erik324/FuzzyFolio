// import Construct from "./Construct.js";
// import ErrorNotification from "./ErrorNotification";
import "./App.css";
import TitleBar from "./TitleBar";
import SignupForm from "./SignupForm";
import { Main } from "./Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Home";
import { useEffect, useState } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import MyAccount from "./MyAccount";
import PetForm from "./PetForm";
import DonationList from "./DonationList";
import MyDonationList from "./MyDonationList";
import DonationForm from "./DonationForm";
import MyPets from "./MyPets";
import PetDetail from "./PetDetail";
import EditMyDonation from "./EditMyDonation";

function App({ baseUrl }) {
  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");
  // const [userId, setUserId] = useState("");
  // const [launchInfo, setLaunchInfo] = useState([]);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   async function getData() {
  //     let url = `${process.env.REACT_APP_API_HOST}/api/launch-details`;
  //     console.log("fastapi url: ", url);
  //     let response = await fetch(url);
  //     console.log("------- hello? -------");
  //     let data = await response.json();

  //     if (response.ok) {
  //       console.log("got launch data!");
  //       setLaunchInfo(data.launch_details);
  //     } else {
  //       console.log("drat! something happened");
  //       setError(data.message);
  //     }
  //   }
  //   getData();
  // }, []);

  const [userId, setUserId] = useState("");
  const { fetchWithToken, token } = useToken();
  const getAccountData = async () => {
    if (token) {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_HOST}/api/accountdata`
      );
      setUserId(response["id"]);
    } else {
      setUserId(null);
    }
  };
  useEffect(() => {
    getAccountData();
  }, [token]);

  useEffect(() => {
    console.log("Account ID: ", userId);
  }, [userId]);

  return (
    <BrowserRouter basename={basename}>
      <div>
        {/* <ErrorNotification error={error} />
        <Construct info={launchInfo} /> */}
        <TitleBar />
        <Routes>
          <Route index path="/" element={<Homepage />}></Route>
          <Route path="/login" element={<Main />}></Route>
          <Route path="/signup" element={<SignupForm />}></Route>
          <Route path="/myaccount" element={<MyAccount userId={userId} />} />
          <Route
            path="/pets/new"
            element={<PetForm userId={userId} baseUrl={baseUrl} />}
          ></Route>
          <Route exact path="/donations" element={<DonationList />}></Route>
          <Route
            exact
            path="/mydonations/"
            element={<MyDonationList accountId={userId} />}
          ></Route>
          <Route
            path="/donations/createDonation"
            element={<DonationForm accountId={userId} />}
          ></Route>
          <Route
            path="/donations/editDonation/:donationId"
            element={<EditMyDonation accountId={userId} />}
          ></Route>
          <Route path="/pets" element={<MyPets userId={userId} />}>
            <Route
              path="{pet_id}"
              element={<PetDetail userId={userId} />}
            ></Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
