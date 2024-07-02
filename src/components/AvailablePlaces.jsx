import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [error, setError] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetchPlaces() {
      setLoadingState(true);
      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        if (!response.ok) {
          throw new Error("Cannot fetch places");
        }
        setAvailablePlaces(resData.places);
      } catch (error) {
        setError({
          message:
            error.message || "Cannot fetch places, please try again later!",
        });
      }
      setLoadingState(false);
    }

    fetchPlaces();
  }, []);

  if(error) {
    return <Error title="Something went wrong!" message={error.message}></Error>
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={loadingState}
      loadingText="Fetching available places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
