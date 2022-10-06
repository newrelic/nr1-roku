import React from 'react';
import PropTypes from 'prop-types';

import { AreaChart, Card, CardBody, CardHeader, LineChart } from 'nr1';

import { subtitleFromQueryTime } from '../../utils/datetime';

const Charts = ({ accountId, charts, whereClause, facets, queryTime }) => {
  return (
    <div className="charts">
      {charts.map((chart, c) => (
        <Card key={c}>
          <CardHeader
            title={chart.title || ''}
            subtitle={subtitleFromQueryTime(queryTime)}
          />
          <CardBody>
            {chart.type === 'area' ? (
              <AreaChart
                accountIds={[accountId]}
                query={`${chart.query} TIMESERIES ${whereClause} ${facets} ${queryTime}`}
                fullWidth
              />
            ) : null}
            {chart.type === 'line' ? (
              <LineChart
                accountIds={[accountId]}
                query={`${chart.query} TIMESERIES ${whereClause} ${facets} ${queryTime}`}
                fullWidth
              />
            ) : null}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

Charts.propTypes = {
  accountId: PropTypes.number,
  charts: PropTypes.array,
  whereClause: PropTypes.string,
  facets: PropTypes.string,
  queryTime: PropTypes.string,
};

export default Charts;
