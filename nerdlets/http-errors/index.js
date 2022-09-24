import React from 'react';

import { AutoSizer, nerdlet, usePlatformState } from 'nr1';

import { default as queries } from './queries';
import Home from '../../library/components/Home';

const HTTPErrorsNerdlet = () => {
  nerdlet.setConfig({ accountPicker: true });
  const [{ accountId, timeRange }] = usePlatformState();

  return (
    <Home 
      accountId={accountId} 
      timeRange={timeRange} 
      summary={{
        title: 'Error Summary',
        queries: [
          queries.errors,
          queries.errorRate,
          queries.affectedUsers,
          queries.affectedUserRate,
        ]
      }} 
      charts={[
        {title: 'Errors', type: 'area', query: queries.errors},
        {title: 'Error Rate %', type: 'line', query: queries.errorRate},
        {title: 'Users Affected', type: 'area', query: queries.affectedUsers},
        {title: 'Users Affected Rate %', type: 'line', query: queries.affectedUserRate},
      ]}
      tableQueries={[queries.errorsList]}
    />
  );
}

export default HTTPErrorsNerdlet;
