import { useEffect, useState } from "react";

import animationData from "./dogAnimation.json";

import { Player } from "@lottiefiles/react-lottie-player";

import { catFacts } from "./cat_facts.js";

function Homepage() {
  const [animalFact, setAnimalFact] = useState("");

  async function getAnimalFact() {
    if (Math.floor(Math.random() * 10) % 2 === 0) {
      const url = "https://dog-api.kinduff.com/api/facts";

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setAnimalFact(data.facts[0]);
      }
    } else {
      const ran_num = Math.floor(Math.random() * 22);
      const fact = catFacts[ran_num];
      setAnimalFact(fact);
    }
  }

  useEffect(() => {
    getAnimalFact();
  }, []);

  return (
    <div className="spacer wave-1">
      <div className="px-4 py-5 mt-5 text-center">
        <div className="container">
          <img
            src="https://i.ibb.co/LhZ0207/Fuzzy-Folio.jpg"
            alt="thrill"
            className="img-fluid"
            width="100%"
          />
        </div>
        <div className="container justify-content-center d-flex mt-1">
          <div
            className="card"
            style={{
              borderRadius: "25px",
              width: "950px",
              backgroundColor: "#E9FEFB",
            }}
            // 636464
          >
            <div className="row mx-5">
              <div className="col-lg-6 mx-auto my-auto">
                <h1 className="display-5 fw-bold">Animal Fact</h1>
                <p className="lead mb-4">{animalFact}</p>
              </div>
              <div className="col">
                <Player src={animationData} loop autoplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
