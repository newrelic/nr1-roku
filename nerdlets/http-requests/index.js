import React from 'react';

import { AutoSizer, nerdlet, usePlatformState } from 'nr1';

import { default as queries } from './queries';
import Home from '../../library/components/Home';

const HttpRequestsNerdlet = () => {
  nerdlet.setConfig({ accountPicker: true });
  const [{ accountId, timeRange }] = usePlatformState();

  return (
    <Home 
      accountId={accountId} 
      timeRange={timeRange} 
      summary={{
        title: 'Requests Summary',
        queries: [
          queries.durationFirstByteTime,
          queries.avgReqsPerSession,
          queries.requestDuration,
        ]
      }}
      charts={[
        {title: 'Duration (First Byte Time)', type: 'line', query: queries.durationFirstByteTime},
        {title: 'Avg Requests Per Session', type: 'line', query: queries.avgReqsPerSession},
        {title: 'Request Duration', type: 'line', query: queries.requestDuration},
      ]}
      tableQueries={[]}
    />
  );
}

export default HttpRequestsNerdlet;
