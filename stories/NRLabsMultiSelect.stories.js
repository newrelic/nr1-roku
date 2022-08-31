import React, { useState } from 'react';

import NRLabsMultiSelect from '../library/components/NRLabsMultiSelect' ;

export default {
  title: 'NRLabsMultiSelect',
  component: NRLabsMultiSelect,
};

export const Primary = () => {
  // Sets the hooks for both the label and primary props
  // const [value, setValue] = useState('Secondary');
  // const [isPrimary, setIsPrimary] = useState(false);
  const [items, setItems] = useState([
    {item: 'Request domain', isSelected: false},
    {item: 'Device model', isSelected: false},
    {item: 'Country code', isSelected: false},
    {item: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', isSelected: false},
    {item: 'HTTP method', isSelected: false},
    {item: 'Error message', isSelected: false},
    {item: 'Error code', isSelected: false},
  ]);

  // Sets a click handler to change the label's value
  // const handleOnChange = () => {
  //   if (!isPrimary) {
  //     setIsPrimary(true);
  //     setValue('Primary');
  //   }
  // };
  // return <Button primary={isPrimary} onClick={handleOnChange} label={value} />;
  return <NRLabsMultiSelect items={items} onChange={setItems} />;
};
