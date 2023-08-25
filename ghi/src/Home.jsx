import { useEffect, useState } from "react";

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
      const url = "https://meowfacts.herokuapp.com/";

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setAnimalFact(data.data);
      }
    }
  }

  useEffect(() => {
    getAnimalFact();
  }, []);

  return (
    <div className="px-4 py-5 my-5 text-center">
      <div className="container">
        <img
          src="https://i.ibb.co/LhZ0207/Fuzzy-Folio.jpg"
          alt="thrill"
          className="img-fluid"
          width="100%"
        />
      </div>
      <h1 className="display-5 fw-bold">Animal Fact</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-4">{animalFact}</p>
      </div>
    </div>
  );
}

export default Homepage;
