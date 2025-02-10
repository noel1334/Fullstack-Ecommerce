import React from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const LocationSelector = ({ location, setLocation }) => {
  const { selectedCountry, selectedState, selectedLGA } = location;

  const countries = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const states =
    selectedCountry &&
    State.getStatesOfCountry(selectedCountry.value).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));

  const cities =
    selectedState &&
    City.getCitiesOfState(selectedCountry.value, selectedState.value).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    );

  return (
    <div className="location-selector">
      <div>
        <label htmlFor="country">Country:</label>
        <Select
          id="country"
          options={countries}
          value={selectedCountry}
          onChange={(country) => {
            setLocation({
              ...location,
              selectedCountry: country,
              selectedState: null,
              selectedLGA: null,
            });
          }}
        />
      </div>

      {selectedCountry && (
        <div>
          <label htmlFor="state">State:</label>
          <Select
            id="state"
            options={states}
            value={selectedState}
            onChange={(state) =>
              setLocation({
                ...location,
                selectedState: state,
                selectedLGA: null,
              })
            }
          />
        </div>
      )}

      {selectedState && (
        <div>
          <label htmlFor="lga">LGA:</label>
          <Select
            id="lga"
            options={cities}
            value={selectedLGA}
            onChange={(lga) => setLocation({ ...location, selectedLGA: lga })}
          />
        </div>
      )}

      <div className="mt-4 text-gray-500 text-x2l">
        <h3>Selected Location:</h3>
        <p>
          Country: {selectedCountry?.label || "None"}, State:{" "}
          {selectedState?.label || "None"}, LGA: {selectedLGA?.label || "None"}
        </p>
      </div>
    </div>
  );
};

export default LocationSelector;
