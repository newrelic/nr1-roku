import React from 'react';
import PropTypes from 'prop-types';

import RemoveIcon from './remove.svg';

const Label = ({ value, onRemove }) => {
  const removeClickHandler = evt => {
    evt.stopPropagation();
    if (onRemove) onRemove(evt);
  };

  return (
    <span className="nrlabs-multi-select-label">
      <span className="nrlabs-multi-select-label-text">{value}</span>
      <span
        className="nrlabs-multi-select-label-remove"
        onClick={removeClickHandler}
      >
        <img src={RemoveIcon} alt="remove" />
      </span>
    </span>
  );
};

Label.propTypes = {
  value: PropTypes.string,
  onRemove: PropTypes.func
};

export default Label;
