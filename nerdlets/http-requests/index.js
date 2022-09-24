import React from 'react';

import { AutoSizer, nerdlet, usePlatformState } from 'nr1';

// import { default as queries } from './queries';
import Home from '../../library/components/Home';

const HttpRequestsNerdlet = () => {
  nerdlet.setConfig({ accountPicker: true });
  const [{ accountId, timeRange }] = usePlatformState();

  return (
    <Home 
      accountId={accountId} 
      timeRange={timeRange} 
      summary={{
        title: '',
        queries: []
      }}
      charts={[]}
      tableQueries={[]}
    />
  );
}

export default HttpRequestsNerdlet;
