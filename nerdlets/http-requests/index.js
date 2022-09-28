import React, { useEffect, useRef } from 'react';

import { AutoSizer, nerdlet, usePlatformState } from 'nr1';

import { default as queries } from './queries';
import Home from '../../library/components/Home';

const HttpRequestsNerdlet = () => {
  nerdlet.setConfig({ accountPicker: true });
  const [{ accountId, timeRange }] = usePlatformState();

  const cachedHome = useRef(null);

  useEffect(() => {
    cachedHome.current = <Home 
      accountId={accountId} 
      timeRange={timeRange} 
      summary={{
        title: 'Requests Summary',
        queries: [
          queries.durationFirstByteTime,
          queries.avgAppReqsPerSession,
          queries.requestDuration,
          queries.avgSysReqsPerSession,
        ]
      }}
      charts={[
        {title: 'Duration (First Byte Time)', type: 'line', query: queries.durationFirstByteTime},
        {title: 'Avg App Requests Per Session', type: 'line', query: queries.avgAppReqsPerSession},
        {title: 'Request Duration', type: 'line', query: queries.requestDuration},
        {title: 'Avg Sys Requests Per Session', type: 'line', query: queries.avgSysReqsPerSession},
      ]}
      tableQueries={[]}
    />;
  }, [accountId, timeRange.begin_time, timeRange.end_time, timeRange.duration]);

  return cachedHome.current;
}

export default HttpRequestsNerdlet;
