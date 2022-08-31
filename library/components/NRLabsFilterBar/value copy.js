import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Value = ({ value, width, optionIndex, valueIndex, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const thisComponent = useRef();

  // useEffect(() => {
  //   function handleClicksOutsideComponent(evt) {
  //     if (showPicker && thisComponent && !thisComponent.current.contains(evt.target)) setShowPicker(false);
  //   }
  //   document.addEventListener('mousedown', handleClicksOutsideComponent);

  //   return function cleanup() {
  //     document.removeEventListener('mousedown', handleClicksOutsideComponent);
  //   };
  // });

  const clickHandler = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    // setShowPicker(!showPicker);
  }

  const changeHandler = evt => {
    // evt.preventDefault();
    // evt.stopPropagation();
    if (onChange) onChange(optionIndex, valueIndex);
    // setShowPicker(true);
  }

  const options = ['AND', 'OR'];
  
  return (
    <div className="nrlabs-filter-bar-list-option-value" style={{width}} ref={thisComponent}>
      <input type="checkbox" id={`nrlabs-filter-bar-checkbox-${value.id}-${valueIndex}`} checked={value.isSelected} onChange={changeHandler} />
      <label for={`nrlabs-filter-bar-checkbox-${value.id}-${valueIndex}`}>{value.display}</label>
      {showPicker && (<span className="nrlabs-filter-bar-list-option-picker">
        <span className={`equal selected`} />
        <span className={`not-equal`} />
      </span>)}
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
