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
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const [alertEmptySearch, setAlertEmptySearch] = useState(false);

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

    //just to make sure alert does not show on non-empty search
    setAlertEmptySearch(false);
    setValue(input);
    setShowClear(true);
    debouncedRequest(input);
    setShowSuggestions(true);
  };

  //when a value is selected from the suggestions
  const handleClick = (e, option) => {
    setShowClear(true);
    setValue(option);
    setShowSuggestions(false);
  };

  //when x is clicked
  const handleClearText = () => {
    setShowClear(false);
    setShowNoResults(false);
    setValue("");
  };

  //handle various key presses
  const handleKeyDownOnInput = (e) => {
    switch (e.keyCode) {
      //handle enter key press; code = 13
      case 13:
        if (options.length > 0 && value !== "") {
          setValue(options[activeOptionIndex]);
          setShowClear(true);
          setShowSuggestions(false);
          setShowNoResults(false);
          setActiveOptionIndex(0);
        }
        //if user enters on empty input
        else if (value === "") {
          setAlertEmptySearch(true);
        }
        break;

      //handle escape key press; code = 27
      case 27:
        setShowSuggestions(false);
        setValue("");
        setShowClear(false);
        setShowNoResults(false);
        break;

      //handle arrow up key press; code = 38
      case 38:
        if (activeOptionIndex > 0) {
          setActiveOptionIndex(activeOptionIndex - 1);
        }
        break;

      //handle arrow down key press; code = 40
      case 40:
        setActiveOptionIndex((activeOptionIndex + 1) % options.length);
        break;

      //default case
      // default:
      //   console.log("do any default behaviour here");
    }
  };

  //change active option on hover of any option
  const changeActiveOption = (e, i) => {
    setActiveOptionIndex(i);
  };

  //render options to the dom
  const renderOptions = options.map((option, index) => {
    /*parts: an array of three substrings
    one of them will be the matching value 
    while rest of the two will be non-matching parts
    */

    const parts = option.split(new RegExp(`(${value})`, "gi"));
    return (
      <li
        key={index}
        onClick={(e) => handleClick(e, option)}
        onMouseOver={(e) => changeActiveOption(e, index)}
        className={index === activeOptionIndex ? "active-option" : ""}
      >
        {/* iterate through parts and apply different style to the matching part */}

        {parts.map((part, i) => (
          <span
            key={i}
            className={
              part.toLowerCase() === value.toLowerCase() ? "match" : ""
            }
          >
            {part}
          </span>
        ))}
      </li>
    );
  });

  return (
    <div className="autocomplete">
      <div className="group">
        <input
          className="autocomplete-input"
          type="text"
          placeholder="start searching"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDownOnInput}
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
        {alertEmptySearch && <p>Please enter something to search!</p>}
      </div>
    </div>
  );
};

export default Autocomplete;
