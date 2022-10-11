import React, { useEffect, useRef } from 'react';

import { nerdlet, usePlatformState } from 'nr1';

import { default as queries } from './queries'; // eslint-disable-line import/no-named-default
import Home from '../../library/components/Home';

const HTTPErrorsNerdlet = () => {
  nerdlet.setConfig({ accountPicker: true });
  const [{ accountId, timeRange }] = usePlatformState();

  const cachedHome = useRef(null);

  useEffect(() => {
    cachedHome.current = (
      <Home
        accountId={accountId}
        timeRange={timeRange}
        summary={{
          title: 'Error Summary',
          queries: [
            queries.errors,
            queries.errorRate,
            queries.affectedUsers,
            queries.affectedUserRate
          ]
        }}
        charts={[
          { title: 'Errors', type: 'area', query: queries.errors },
          { title: 'Error Rate %', type: 'line', query: queries.errorRate },
          {
            title: 'Users Affected',
            type: 'area',
            query: queries.affectedUsers
          },
          {
            title: 'Users Affected Rate %',
            type: 'line',
            query: queries.affectedUserRate
          }
        ]}
        tableQueries={[queries.errorsList]}
      />
    );
  }, [accountId, timeRange.begin_time, timeRange.end_time, timeRange.duration]);

  return cachedHome.current;
};

export default HTTPErrorsNerdlet;
