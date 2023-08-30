import useToken from "@galvanize-inc/jwtdown-for-react";
import { useEffect, useState } from "react";

function MyPets({ userId }) {
  const { token, fetchWithToken } = useToken();
  const [pets, setPets] = useState([]);
  const [myPets, setMyPets] = useState([]);

  const getPets = async () => {
    if (token) {
      const GetPetsUrl = `${process.env.REACT_APP_API_HOST}/api/pets`;
      const response = await fetchWithToken(GetPetsUrl, "GET");
      // console.log("response.pets", response["pets"]);
      setPets(response["pets"]);
    }
  };

  function filteredPets() {
    // console.log("pets", pets);
    const filteredPets = pets.filter((pet) => pet["owner_id"] === userId);
    setMyPets(filteredPets);
    // console.log("filteredPets", filteredPets);
  }

  useEffect(() => {
    getPets();
  }, [token]);

  useEffect(() => {
    filteredPets();
  }, [pets]);

  return (
    <div className="p-4 mt-4">
      <h1>My Pets</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Pet Name</th>
          </tr>
        </thead>
        <tbody>
          {token &&
            myPets.map((pet) => {
              return (
                <tr key={pet.id}>
                  <td>{pet.pet_name}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default MyPets;
