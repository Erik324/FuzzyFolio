// import { useEffect, useState } from "react";
// import Construct from "./Construct.js";
// import ErrorNotification from "./ErrorNotification";
import "./App.css";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import TitleBar from "./TitleBar";
import SignupForm from "./SignupForm";
import { Main } from "./Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Home";

function App() {
  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");
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

  return (
    <BrowserRouter basename={basename}>
      <AuthProvider baseUrl={process.env.REACT_APP_API_HOST}>
        <div>
          {/* <ErrorNotification error={error} />
        <Construct info={launchInfo} /> */}
          <TitleBar />
          <Routes>
            <Route index path="/" element={<Homepage />}></Route>
            <Route exact path="/login" element={<Main />}></Route>
            <Route exact path="/signup" element={<SignupForm />}></Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
