import useToken from "@galvanize-inc/jwtdown-for-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetsIcon from "@mui/icons-material/Pets";

function MyPets({ userId }) {
  const { token, fetchWithToken } = useToken();
  const [pets, setPets] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const navigate = useNavigate();

  const getPets = async () => {
    if (token) {
      const GetPetsUrl = `${process.env.REACT_APP_API_HOST}/api/pets`;
      const response = await fetchWithToken(GetPetsUrl, "GET");
      setPets(response["pets"]);
    }
  };

  function filteredPets() {
    const filteredPets = pets.filter((pet) => pet["owner_id"] === userId);
    setMyPets(filteredPets);
  }

  function handleOnePetClick(petId) {
    navigate(`/pets/${petId}`);
  }

  const makeColumns = (array, columnsCount) => {
    const result = [];
    for (let i = 0; i < array.length; i += columnsCount) {
      result.push(array.slice(i, i + columnsCount));
    }
    return result;
  };

  const petColumns = makeColumns(myPets, 3);

  useEffect(() => {
    getPets();
  }, [token]); // eslint-disable-line

  useEffect(() => {
    filteredPets();
  }, [pets]); // eslint-disable-line

  return (
    <section>
      <div className="px-4 pt-5  text-center">
        {token && (
          <div className="container pt-5">
            <h1>My Pets</h1>
            <div className="row">
              {petColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="row">
                  {column.map((pet) => (
                    <div key={pet.id} className="col-lg-4">
                      <div className="card mb-3 p-3">
                        <img
                          src={pet.picture}
                          alt={pet.pet_name}
                          onClick={() => handleOnePetClick(pet.id)}
                          className="card-img-top"
                        />
                        <div className="card-body">
                          <h5 className="card-title">
                            {pet.pet_name}
                            <PetsIcon style={{ fontSize: 21, color: "pink" }} />
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="air air1"></div>
        <div className="air air2"></div>
        <div className="air air3"></div>
        <div className="air air4"></div>
      </div>
    </section>
  );
}

export default MyPets;
