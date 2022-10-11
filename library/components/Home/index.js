import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { EmptyState, NerdGraphQuery, ngql as gql, NrqlQuery } from 'nr1';

import NRLabsMultiSelect from '../NRLabsMultiSelect';
import NRLabsFilterBar from '../NRLabsFilterBar';

import Charts from './charts';
import SummaryBar from './summary';
import homeQueries from './queries';
import QueryTable from '../QueryTable';

import { timeStringFromTimeRange } from '../../utils/datetime';

const Home = ({ accountId, timeRange, summary, charts, tableQueries }) => {
  const [groups, setGroups] = useState([
    { item: 'domain', display: 'Request Domain', isSelected: false },
    { item: 'deviceModel', display: 'Device Model', isSelected: false },
    { item: 'countryCode', display: 'Country code', isSelected: false },
    { item: 'method', display: 'HTTP Method', isSelected: false },
    { item: 'status', display: 'Error Message', isSelected: false },
    { item: 'httpCode', display: 'Error Code', isSelected: false }
  ]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filters, setFilters] = useState('');
  const [loading, setLoading] = useState(false);
  const [queryTime, setQueryTime] = useState('');
  const [facets, setFacets] = useState('');
  const [whereClause, setWhereClause] = useState('');

  useEffect(() => {
    const loadAttributes = async () => {
      if (accountId === 'cross-account') return;
      setLoading(true);

      const qryTime = timeStringFromTimeRange(timeRange);
      setQueryTime(qryTime);

      const accountIds = [accountId];

      const {
        data: [{ data: dataAttr } = {}],
        error: errAttr
      } = await NrqlQuery.query({
        accountIds,
        query: homeQueries.attributesQuery(qryTime)
      });

      if (errAttr || !dataAttr || !dataAttr.length) {
        setLoading(false);
        console.log('ERROR: unable to retrieve attributes'); // eslint-disable-line no-console
        return;
      }

      const [resp] = dataAttr;
      const recAttrs = groups.map(grp => grp.item);
      const [recs, other] = ['boolean', 'numeric', 'string'].reduce(
        (acc, type) => {
          const keys = resp[`${type}Keys`];
          (keys || []).forEach(key => {
            const group = +!recAttrs.find(ga => ga === key);
            if (!isExcludedAttrib(key))
              acc[group].push({
                option: key,
                type,
                values: [],
                group: `${group ? 'other' : 'recommended'} filters`
              });
          });
          return acc;
        },
        [[], []]
      );

      const query = gql`
        ${homeQueries.valuesQuery(recAttrs, qryTime)}
      `;
      const variables = { accounts: accountIds };
      const {
        data: { actor: recValues } = {},
        error: errVal
      } = await NerdGraphQuery.query({ query, variables });

      if (errVal || !recValues) {
        setLoading(false);
        console.log('ERROR loading attribute values', errVal); // eslint-disable-line no-console
        return;
      }

      const recommended = recAttrs.reduce((acc, attr, i) => {
        const attrKey = `attr${i}`;
        if (attrKey in recValues) {
          const { results: [values] = [] } = recValues[attrKey];
          if (values && values.uniques) {
            const recIdx = recs.findIndex(rec => rec.option === attr);
            if (recIdx > -1) acc[recIdx].values = values.uniques;
          }
        }
        return acc;
      }, recs);
      const filterOpts = [...recommended, ...other];
      setFilterOptions(filterOpts);
      setLoading(false);
    };

    if (!loading) loadAttributes();
  }, [accountId, timeRange.begin_time, timeRange.end_time, timeRange.duration]);

  useEffect(() => {
    const selectedFacets = groups.reduce(
      (acc, group) => (group.isSelected ? [...acc, group.item] : acc),
      []
    );
    setFacets(
      selectedFacets.length ? `FACET ${selectedFacets.join(', ')}` : ''
    );
  }, [groups]);

  useEffect(() => {
    setWhereClause(filters ? `WHERE ${filters}` : '');
  }, [filters]);

  const isExcludedAttrib = attr =>
    /entity.|nr.|timestamp|actionName/.test(attr);

  const getValues = async (option, conditions) => {
    const query = gql`
      ${homeQueries.valuesQuery([option], queryTime, conditions)}
    `;
    const variables = { accounts: [accountId] };
    const { data, error } = await NerdGraphQuery.query({ query, variables });
    if (error) return [];
    const {
      actor: { attr0: { results: [vals] } = { results: [] } } = {}
    } = data;
    return vals && vals.uniques && vals.uniques.length ? vals.uniques : [];
  };

  if (!accountId || accountId === 'cross-account')
    return (
      <EmptyState
        fullHeight
        fullWidth
        type={EmptyState.TYPE.ERROR}
        iconType={EmptyState.ICON_TYPE.INTERFACE__STATE__CRITICAL}
        title="No account selected!"
        description="Please choose an account to get started."
      />
    );

  return (
    <div className="container">
      <div className="wrapper">
        <div className="control-bar">
          <NRLabsMultiSelect items={groups} onChange={setGroups} />
          <NRLabsFilterBar
            options={filterOptions}
            filters={filters}
            onChange={setFilters}
            getValues={getValues}
          />
        </div>
      </div>

      <div className="wrapper">
        <SummaryBar
          accountId={accountId}
          summaryQueries={summary.queries || []}
          whereClause={whereClause}
          queryTime={queryTime}
          title={summary.title || 'Summary'}
        />
      </div>

      <Charts
        accountId={accountId}
        charts={charts || []}
        whereClause={whereClause}
        facets={facets}
        queryTime={queryTime}
      />

      {tableQueries.map((tableQuery, t) => (
        <div
          className="wrapper"
          style={{
            padding: 0,
            marginBottom: t < tableQueries.length - 1 ? 'auto' : 0
          }}
          key={t}
        >
          <QueryTable
            accountId={accountId}
            baseQuery={tableQuery}
            whereClause={whereClause}
            queryTime={queryTime}
            title="Errors"
          />
        </div>
      ))}
    </div>
  );
};

Home.propTypes = {
  accountId: PropTypes.number,
  timeRange: PropTypes.object,
  summary: PropTypes.object,
  charts: PropTypes.array,
  tableQueries: PropTypes.array
};

export default Home;
