import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  AutoSizer,
  EmptyState,
  NerdGraphQuery,
  ngql as gql,
  NrqlQuery,
} from 'nr1';

import NRLabsMultiSelect from '../NRLabsMultiSelect';
import NRLabsFilterBar from '../NRLabsFilterBar';

import Charts from './charts';
import SummaryBar from './summary';
import homeQueries from './queries';
import QueryTable from '../QueryTable';

import { timeStringFromTimeRange } from '../../utils/datetime';

const Home = ({ accountId, timeRange, summary, charts, tableQueries }) => {
  const [groups, setGroups] = useState([
    {item: 'domain', display: 'Request Domain', isSelected: false},
    {item: 'deviceModel', display: 'Device Model', isSelected: false},
    {item: 'countryCode', display: 'Country code', isSelected: false},
    {item: 'method', display: 'HTTP Method', isSelected: false},
    {item: 'status', display: 'Error Message', isSelected: false},
    {item: 'httpCode', display: 'Error Code', isSelected: false},
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
        data: [{data} = {}], error: errAttr, loading: loadAttr
      } = await NrqlQuery.query({ 
        accountIds, 
        query: homeQueries.attributesQuery(qryTime) 
      });

      if (errAttr || !data.length) {
        setLoading(false);
        console.log('unable to retrieve attributes');
        return;
      }

      const [resp] = data;
      const attrs = ['boolean', 'numeric', 'string'].reduce((acc, type) => {
        const res = resp[`${type}Keys`];
        if (res && res.length) res.reduce((_, key) => {
          if (!isExcludedAttrib(key)) acc[key] = {type, values: {}};
        });
        return acc;
      }, {});
      // console.log('attrs', Object.keys(attrs).length, attrs)

      const query = gql`${homeQueries.valuesQuery(qryTime)}`;
      const variables = { accounts: accountIds };
      const {
        data: {actor: {values: {results: values} = {}} = {}} = {},
        error: errVal,
      } = await NerdGraphQuery.query({ query, variables });
      
      if (errVal || !values) {
        setLoading(false);
        console.log('ERROR loading attribute values', errVal);
        return;
      }
      const attributes = values.reduce((acc, row) => {
        Object.keys(row).reduce((_, attr) => {
          if (isExcludedAttrib(attr)) return;
          const val = row[attr];
          if (val == null || val === "") return;
          if (attr in acc && !(val in acc[attr]['values'])) acc[attr]['values'][val] = "";
        });
        return acc;
      }, attrs);
      // console.log('attributes', Object.keys(attributes).length, attributes)

      const [recommended, other] = Object.keys(attributes).reduce((acc, attr) => {
        const group = +(!groups.some(grp => grp.item === attr));
        acc[group].push({
          option: attr,
          type: attributes[attr]['type'], 
          values: Object.keys(attributes[attr]['values']), 
          group: `${group ? 'other' : 'recommended'} filters`,
        });
        return acc;
      }, [[], []]);

      setFilterOptions([...recommended, ...other]);
      setLoading(false);
    };

    if (!loading) loadAttributes();
  }, [accountId, timeRange.begin_time, timeRange.end_time, timeRange.duration]);

  useEffect(() => {
    const selectedFacets = groups.reduce((acc, group) => (group.isSelected ? [...acc, group.item] : acc), []);
    // console.log('selectedFacets', selectedFacets)
    setFacets(selectedFacets.length ? `FACET ${selectedFacets.join(', ')}` : '');
  }, [groups]);

  useEffect(() => {
    // console.log('filters', filters)
    setWhereClause(filters ? `WHERE ${filters}` : '');
  }, [filters]);

  const isExcludedAttrib = attr => /entity.|nr.|timestamp|actionName/.test(attr);

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
          <NRLabsFilterBar options={filterOptions} filters={filters} onChange={setFilters} />
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
        <div className="wrapper" style={{padding: 0, marginBottom: t < tableQueries.length - 1 ? 'auto' : 0}}>
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
}

Home.propTypes = {
  accountId: PropTypes.number,
  timeRange: PropTypes.object,
  summary: PropTypes.object,
  charts: PropTypes.array,
  tableQueries: PropTypes.array,
};

export default Home;
