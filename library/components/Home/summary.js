import React from 'react';
import PropTypes from 'prop-types';

import { BillboardChart } from 'nr1';

import { subtitleFromQueryTime } from '../../utils/datetime';

const SummaryBar = ({
  accountId,
  summaryQueries,
  whereClause,
  queryTime,
  title,
}) => {
  const billboardStyles = { height: '60px', width: '96px' };

  return (
    <div className="summary">
      <div className="header">
        <h4>{title}</h4>
        <small>{subtitleFromQueryTime(queryTime)}</small>
      </div>
      {summaryQueries.map((query, q) => (
        <div className="metric" key={q}>
          <BillboardChart
            accountIds={[accountId]}
            query={`${query} ${whereClause} ${queryTime}`}
            style={billboardStyles}
          />
        </div>
      ))}
    </div>
  );
};

SummaryBar.propTypes = {
  accountId: PropTypes.number,
  summaryQueries: PropTypes.array,
  whereClause: PropTypes.string,
  queryTime: PropTypes.string,
  title: PropTypes.string,
};

export default SummaryBar;
