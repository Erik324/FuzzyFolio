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
import EditAccount from "./EditAccount";
import MyPets from "./MyPets";
import PetDetail from "./PetDetail";
import EditMyDonation from "./EditMyDonation";
import EditMyPet from "./EditMyPet";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import VaccineForm from "./VaccineForm.jsx";
import ProtectedRoute from "./ProtectedRoute";

const theme = createTheme();

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
  const [user, setUser] = useState({});
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
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={basename}>
        <div>
          {/* <ErrorNotification error={error} />
        <Construct info={launchInfo} /> */}
          <TitleBar />
          <Routes>
            <Route index path="/" element={<Homepage />}></Route>
            <Route exact path="/login" element={<Main />}></Route>
            <Route exact path="/signup" element={<SignupForm />}></Route>
            <Route path="myaccount">
              <Route
                index
                element={
                  <ProtectedRoute token={token}>
                    <MyAccount userId={userId} />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="edit"
                element={
                  <ProtectedRoute token={token}>
                    <EditAccount userId={userId} />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="/pets/new"
              element={
                <ProtectedRoute token={token}>
                  <PetForm userId={userId} baseUrl={baseUrl} />
                </ProtectedRoute>
              }
            ></Route>
            <Route exact path="/donations" element={<DonationList />}></Route>
            <Route
              exact
              path="/mydonations/"
              element={
                <ProtectedRoute token={token}>
                  <MyDonationList accountId={userId} />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/donations/createDonation"
              element={
                <ProtectedRoute token={token}>
                  <DonationForm accountId={userId} />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/donations/editDonation/:donationId"
              element={
                <ProtectedRoute token={token}>
                  <EditMyDonation accountId={userId} />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/pets">
              <Route
                index
                element={
                  <ProtectedRoute token={token}>
                    <MyPets userId={userId} />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path=":petId"
                element={
                  <ProtectedRoute token={token}>
                    <PetDetail userId={userId} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":petId/edit"
                element={
                  <ProtectedRoute token={token}>
                    <EditMyPet userId={userId} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":petId/addVaccine"
                element={
                  <ProtectedRoute token={token}>
                    <VaccineForm />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
