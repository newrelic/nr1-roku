import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import GroupByIcon from './group.svg';
import Label from './label';

const NRLabsMultiSelect = ({ items, onChange }) => {
  const thisComponent = useRef();
  const inputField = useRef();
  const [showItemsList, setShowItemsList] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    function handleClicksOutsideComponent(evt) {
      if (
        showItemsList &&
        thisComponent &&
        !thisComponent.current.contains(evt.target)
      )
        setShowItemsList(false);
    }
    document.addEventListener('mousedown', handleClicksOutsideComponent);

    return function cleanup() {
      document.removeEventListener('mousedown', handleClicksOutsideComponent);
    };
  });

  const checkHandler = (idx) => {
    if (onChange) {
      const { updatedItems, updatedSelectedItems } = items.reduce(
        (acc, item, i) => {
          if (i === idx) item.isSelected = !item.isSelected;
          if (item.isSelected)
            acc.updatedSelectedItems.push({ item: item.item, index: i });
          acc.updatedItems.push(item);
          return acc;
        },
        { updatedItems: [], updatedSelectedItems: [] }
      );
      onChange(updatedItems);
      setSelectedItems(updatedSelectedItems);
    } else {
      // eslint-disable-next-line no-console
      console.error('NRLabs Multi Select Error: onChange is required!');
    }
  };

  const removeHandler = (idx) => {
    if (onChange) {
      const selectedIndex = selectedItems[idx].index;
      onChange(
        items.map((item, i) =>
          i === selectedIndex ? { ...item, isSelected: false } : item
        )
      );
      setSelectedItems(selectedItems.filter((_, i) => i !== idx));
    } else {
      // eslint-disable-next-line no-console
      console.error('NRLabs Multi Select Error: onChange is required!');
    }
  };

  const itemsListWidth =
    inputField && inputField.current
      ? inputField.current.clientWidth - 14
      : 'auto';
  const checkboxWidth =
    inputField && inputField.current ? (itemsListWidth - 32) / 2 : 'auto';

  return (
    <div className="nrlabs-multi-select" ref={thisComponent}>
      <div className="nrlabs-multi-select-input-field" ref={inputField}>
        <div className="nrlabs-multi-select-input-field-icon">
          <img src={GroupByIcon} alt="group by" />
        </div>
        <div
          className={`nrlabs-multi-select-input-field-input ${
            !selectedItems.length ? 'placeholder' : ''
          }`}
          onClick={() => setShowItemsList(!showItemsList)}
        >
          {selectedItems.map((item, i) => (
            <Label
              key={i}
              value={item.item}
              onRemove={() => removeHandler(i)}
            />
          ))}
          {!selectedItems.length ? 'Group by...' : ''}
        </div>
      </div>
      {showItemsList ? (
        <div
          className="nrlabs-multi-select-list"
          style={{ width: itemsListWidth }}
        >
          {items.map((item, i) => (
            <div
              className="nrlabs-multi-select-list-item"
              style={{ width: checkboxWidth }}
              key={i}
            >
              <input
                type="checkbox"
                id={`nrlabs-multi-select-checkbox-${item.item.replaceAll(
                  '^[^a-zA-Z_$]|[^\\w$]',
                  '_'
                )}-${i}`}
                checked={item.isSelected}
                onChange={() => checkHandler(i)}
              />
              <label
                htmlFor={`nrlabs-multi-select-checkbox-${item.item.replaceAll(
                  '^[^a-zA-Z_$]|[^\\w$]',
                  '_'
                )}-${i}`}
              >
                {item.item}
              </label>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

NRLabsMultiSelect.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      item: PropTypes.string,
      isSelected: PropTypes.bool,
    })
  ),
  onChange: PropTypes.func,
};

export default NRLabsMultiSelect;
