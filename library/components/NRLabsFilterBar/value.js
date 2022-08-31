import React from 'react';
import PropTypes from 'prop-types';

const Value = ({ value, width, optionIndex, valueIndex, onChange }) => {
  const changeHandler = () => onChange ? onChange(optionIndex, valueIndex) : null;
  
  return (
    <div className="nrlabs-filter-bar-list-option-value" style={{width}}>
      <input type="checkbox" id={`nrlabs-filter-bar-checkbox-${value.id}-${valueIndex}`} checked={value.isSelected} onChange={changeHandler} />
      <label for={`nrlabs-filter-bar-checkbox-${value.id}-${valueIndex}`}>{value.display}</label>
    </div>
  );
}

Value.propTypes = {
  value: PropTypes.object,
  width: PropTypes.any,
  optionIndex: PropTypes.number,
  valueIndex: PropTypes.number,
  onChange: PropTypes.func,
};

export default Value;
