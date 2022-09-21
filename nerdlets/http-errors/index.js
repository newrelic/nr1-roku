import React, { useState, useEffect } from 'react';

import {
  AreaChart,
  AutoSizer,
  BillboardChart,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  LineChart,
  NerdGraphQuery,
  nerdlet,
  ngql as gql,
  NrqlQuery,
  usePlatformState,
} from 'nr1';

import NRLabsFilterBar from '../../library/components/NRLabsFilterBar';
import NRLabsMultiSelect from '../../library/components/NRLabsMultiSelect';
import QueryTable from '../../library/components/QueryTable';
import queries from './queries';
import { formatTimestamp } from '../../library/utils/datetime';

const HTTPErrorsNerdlet = () => {
  nerdlet.setConfig({ accountPicker: true });
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
  const [{ accountId, timeRange }] = usePlatformState();

  const [queryTime, setQueryTime] = useState('');
  const [facets, setFacets] = useState('');
  const [whereClause, setWhereClause] = useState('');
  const [displayTime, setDisplayTime] = useState({});

  useEffect(() => {
    const loadAttributes = async () => {
      if (accountId === 'cross-account') return;
      setLoading(true);
      
      const qryTime = timeRange.duration
      ? `SINCE ${Date.now() - timeRange.duration}`
      : `SINCE ${timeRange.begin_time} UNTIL ${timeRange.end_time}`;
      setQueryTime(qryTime);
      
      const accountIds = [accountId];
      const attribsQuery = `SELECT keySet() FROM RokuSystem ${qryTime}`;

      const {
        data: [{data, metadata} = {}], 
        error: errAttr, loading: loadAttr
      } = await NrqlQuery.query({ accountIds, query: attribsQuery });

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
      setDisplayTime({begin: resp.begin_time, end: resp.end_time});
      
      // console.log('attrs', Object.keys(attrs).length, attrs)

      const valsQuery = `SELECT * FROM RokuSystem LIMIT MAX ${qryTime}`;
      const query = gql`
        query AttributesQuery($accounts: [Int!]!) {
          actor {
            vals: nrql(accounts: $accounts, query: "${valsQuery}") {
              results
            }
          }
        }
      `;
      const variables = { accounts: accountIds };
      const {
        data: {actor: {vals: {results: vals} = {}} = {}} = {},
        error: errVal,
      } = await NerdGraphQuery.query({ query, variables });
      
      if (errVal || !vals) {
        setLoading(false);
        console.log('ERROR loading attribute values', errVal);
        return;
      }
      const attributes = vals.reduce((acc, row) => {
        Object.keys(row).reduce((_, attr) => {
          if (isExcludedAttrib(attr)) return;
          const val = row[attr];
          if (val == null || val === "") return;
          if (attr in acc && !(val in acc[attr]['values'])) acc[attr]['values'][val] = "";
        });
        return acc;
      }, attrs);
      
      console.log('attributes', Object.keys(attributes).length, attributes)
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
    console.log('selectedFacets', selectedFacets)
    setFacets(selectedFacets.length ? `FACET ${selectedFacets.join(', ')}` : '')
  }, [groups]);

  useEffect(() => {
    console.log('filters', filters)
    const where = filters ? `WHERE ${filters}` : '';
    setWhereClause(where);
  }, [filters]);

  const isExcludedAttrib = attr => /entity.|nr.|timestamp|actionName/.test(attr);

  const billboardStyles = {height: '60px', width: '96px'};

  if (accountId === 'cross-account')
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
      <div className="control-bar">
        <NRLabsMultiSelect items={groups} onChange={setGroups} />
        <NRLabsFilterBar options={filterOptions} filters={filters} onChange={setFilters} />
      </div>
      <div className="charts">
        <div className="summary">
          <div className="header">
            <h4>Error Summary</h4>
            <small>{
              displayTime.begin && displayTime.end 
                ? `${formatTimestamp(displayTime.begin)} - ${formatTimestamp(displayTime.end)}`
                : null
            }</small>
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.errors} ${whereClause} ${queryTime}`} style={billboardStyles} />
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.errorRate} ${whereClause} ${queryTime}`} style={billboardStyles} />
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.affectedUsers} ${whereClause} ${queryTime}`} style={billboardStyles} />
          </div>
          <div className="metric">
            <BillboardChart accountIds={[accountId]} query={`${queries.affectedUserRate} ${whereClause} ${queryTime}`} style={billboardStyles} />
          </div>
        </div>
        <Card>
          <CardHeader title="Errors" subtitle="" />
          <CardBody>
            <AreaChart accountIds={[accountId]} query={`${queries.errors} TIMESERIES ${whereClause} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Error Rate %" subtitle="" />
          <CardBody>
            <LineChart accountIds={[accountId]} query={`${queries.errorRate} TIMESERIES ${whereClause} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Users Affected" subtitle="" />
          <CardBody>
            <AreaChart accountIds={[accountId]} query={`${queries.affectedUsers} TIMESERIES ${whereClause} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Users Affected Rate %" subtitle="" />
          <CardBody>
            <LineChart accountIds={[accountId]} query={`${queries.affectedUserRate} TIMESERIES ${whereClause} ${facets} ${queryTime}`} fullWidth />
          </CardBody>
        </Card>
        <div className="full-width">
          <QueryTable accountId={accountId} baseQuery={queries.errorsList} whereClause={whereClause} queryTime={queryTime} title="Errors" />
        </div>
      </div>
    </div>
  );
}

export default HTTPErrorsNerdlet;
