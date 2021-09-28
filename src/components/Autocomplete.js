import React, { useRef, useState } from "react";

import "../styles/style.css";

//options must be an array of strings to be rendered
const Autocomplete = ({
  options,
  makeRequest,
  onNoResults,
  messageOnNoResults,
  showSuggestions,
  setShowSuggestions,
  setShowNoResults,
}) => {
  const [value, setValue] = useState("");
  const [showClear, setShowClear] = useState(false);

  //debounce method
  const debounce = (callback, delay) => {
    let timer;
    return (val) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(val);
      }, delay);
    };
  };

  //debounce the request for an interval
  let debouncedRequest = useRef(
    debounce((nextVal) => makeRequest(nextVal), 200)
  ).current;

  //on change of input value
  const handleChange = (e) => {
    let input = e.target.value;
    setValue(input);
    setShowClear(true);
    debouncedRequest(input);
    setShowSuggestions(true);
  };

  //when a value is selected from the suggestions
  const handleClick = (e) => {
    const selectedValue = e.target.innerText;
    setShowClear(true);
    setValue(selectedValue);
    setShowSuggestions(false);
  };

  //when x is clicked
  const handleClearText = () => {
    setShowClear(false);
    setShowNoResults(false);
    setValue("");
  };

  const renderOptions = options.map((option, index) => (
    <li key={index} onClick={handleClick}>
      {option}
    </li>
  ));

  return (
    <div className="autocomplete">
      <div className="group">
        <input
          className="autocomplete-input"
          type="text"
          placeholder="start searching"
          value={value}
          onChange={handleChange}
        />
        {showClear && (
          <span className="clear-text" onClick={handleClearText}>
            x
          </span>
        )}
        {!!(showSuggestions && value && options.length) && (
          <ul className="suggestions">{renderOptions}</ul>
        )}
        {!showSuggestions && onNoResults && <p>{messageOnNoResults}</p>}
      </div>
    </div>
  );
};

export default Autocomplete;
