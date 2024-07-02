import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [error, setError] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetchPlaces() {
      setLoadingState(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );

          setAvailablePlaces(sortedPlaces);
          setLoadingState(false);
        });
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

  if (error) {
    return (
      <Error title="Something went wrong!" message={error.message}></Error>
    );
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
