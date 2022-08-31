import React, { useState } from 'react';
import NRLabsFilterBar from '../../library/components/NRLabsFilterBar';

import NRLabsMultiSelect from '../../library/components/NRLabsMultiSelect';

const HomeNerdlet = () => {
  const [groups, setGroups] = useState([
    {item: 'Request domain', isSelected: false},
    {item: 'Device model', isSelected: false},
    {item: 'Country code', isSelected: false},
    {item: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', isSelected: false},
    {item: 'HTTP method', isSelected: false},
    {item: 'Error message', isSelected: false},
    {item: 'Error code', isSelected: false},
  ]);

  const filterOptions = [
    {option: 'appBuild', values: [7366, 7411, 7399, 7412, 7405, 7365, 7098, 7963, 7123, 7456, 7260, 7256, 7090, 7089, 7643, 7001, 7470], group: 'recommended filters'},
    {option: 'appVersion', values: ['3.4.11', '3.3.11', '3.3.23', '2.7.11', '3.3.12', '3.1.02', '3.0.0', '2.9.0', '3.0.01', '3.1.12', '3.1.1'], group: 'recommended filters'},
    {option: 'bandwidth', values: [28445, 30321, 27942, 28235, 52336, 21222, 33280], group: 'recommended filters'},
    {option: 'countryCode', values: ['AE', 'US', 'CA'], group: 'recommended filters'},
    {option: 'deviceGroup', values: ['Roku'], group: 'other filter groups'},
    {option: 'deviceModel', values: ['3910X', '3940X', '3920X', '4200X', '3930X', '4000X', '4100X', '3900X'], group: 'other filter groups'},
    {option: 'timeSinceLoad', values: [4511, 1395, 5108, 12311, 7573], group: 'other filter groups'},
    {option: 'videoMode', info: '', values: ['1080p', '2160p60', '1080p60b10', '720p', '2160p60b10'], group: 'other filter groups', info: 'video mode info goes here'},
  ];

  const [filters, setFilters] = useState('');

  return (
    <div className="container">
      <div className="control-bar">
        <NRLabsMultiSelect items={groups} onChange={setGroups} />
        <NRLabsFilterBar options={filterOptions} filters={filters} onChange={setFilters} />
      </div>
      <div className="dummy-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
      </div>
    </div>
  );
}

export default HomeNerdlet;
