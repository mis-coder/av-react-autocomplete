import React, { useState } from "react";

import Autocomplete from "./Autocomplete";
import cities from "../data/cities";

const SearchCities = () => {
  const [options, setOptions] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchCities = async (val) => {
    console.log("request made");
    if (val) {
      const cityNames = cities
        .filter((city) => city.name.toLowerCase().includes(val.toLowerCase()))
        .map((city) => city.name);
      setOptions(cityNames);

      if (cityNames.length > 0) {
        setOptions(cityNames);
      } else {
        setShowNoResults(true);
        setShowSuggestions(false);
      }
    }
  };

  return (
    <div>
      <h1>
        <center>Search Indian Cities</center>
      </h1>
      <Autocomplete
        options={options}
        makeRequest={fetchCities}
        onNoResults={showNoResults}
        setShowNoResults={setShowNoResults}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        messageOnNoResults="Sorry, no matching results"
      />
    </div>
  );
};

export default SearchCities;
