import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import FilterByIcon from './filter.svg';
import SearchIcon from './search.svg';
import CloseIcon from './close.svg';
import OpenIcon from './open.svg';
import Label from './label';
import Conjunction from './conjunction';
import Value from './value';

const NRLabsFilterBar = ({ options, filters, onChange }) => {
  const thisComponent = useRef();
  const inputField = useRef();
  const [showItemsList, setShowItemsList] = useState(false);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [currentGroup, setCurrentGroup] = useState('');
  const [searchTexts, setSearchTexts] = useState([]);
  const [displayOptions, setDisplayOptions] = useState(options.map((o, i) => !i));
  const [optionShouldMatch, setOptionShouldMatch] = useState(options.map(o => true));
  const [optionFilterMatch, setOptionFilterMatch] = useState(options.map(o => true));
  const [optionsSearchText, setOptionsSearchText] = useState('');
  const [values, setValues] = useState(options.map(o => (o.values || []).map(v => ({
    value: v,
    display: String(v),
    id: String(v).replaceAll('^[^a-zA-Z_$]|[^\\w$]', '_'),
    type: typeof v,
    attribute: o.option,
    isIncluded: true,
    isSelected: false,
    shouldMatch: true,
  }))));
  const [shownValues, setShownValues] = useState(options.map(o => o.values.length > 6 ? 5 : o.values.length));
  const [conjunctions, setConjunctions] = useState([]);

  const MIN_ITEMS_SHOWN = 5;
  const MAX_DROPDOWN_WIDTH = 360;

  useEffect(() => {
    function handleClicksOutsideComponent(evt) {
      if (showItemsList && thisComponent && !thisComponent.current.contains(evt.target)) setShowItemsList(false);
    }
    document.addEventListener('mousedown', handleClicksOutsideComponent);

    return function cleanup() {
      document.removeEventListener('mousedown', handleClicksOutsideComponent);
    };
  });

  const itemsListWidth = inputField && inputField.current ? inputField.current.clientWidth - 14 : MAX_DROPDOWN_WIDTH;
  const dropdownWidth = Math.min(itemsListWidth, MAX_DROPDOWN_WIDTH);
  const checkboxWidth = (dropdownWidth - 32) / 2;

  const checkHandler = (optionIdx, valueIdx) => {
    const vals = [...values];
    // const cnjctns = [...conjunctions];
    vals[optionIdx][valueIdx]['isSelected'] = !vals[optionIdx][valueIdx]['isSelected'];
    // setValues(values.map((vals, i) => vals.map((val, j) => i === optionIdx && j === valueIdx ? {...values[i][j], isSelected: !values[i][j]['isSelected']} : values[i][j])));
    setValues(vals);
    const fltrItems = vals.reduce((qry, opt, i) => {
      opt.reduce((qry, val, j) => {
        if (!val.isSelected) return qry;
        const idx = +!val.shouldMatch;
        // if (!(val.attribute in qry[idx])) qry[idx][val.attribute] = {optionIndex: i, type: val.type, values: []};
        // qry[idx][val.attribute].values.push(val.value);
        if (!(val.attribute in qry[idx])) qry[idx][val.attribute] = {
          attribute: val.attribute,
          optionIndex: i, 
          type: val.type, 
          matchType: val.shouldMatch, 
          valueIndexes: [],
        };
        qry[idx][val.attribute].valueIndexes.push(j);
        return qry;
      }, qry);
      return qry;
    }, [{}, {}])
    .reduce((fi, matches) => Object.keys(matches).reduce((fi, opt) => [...fi, matches[opt]] , fi), []);
    
    // if (fltrItems.length > 1 && conjunctions.length < fltrItems.length - 1) setConjunctions([...conjunctions, 'AND']);
    
    if (conjunctions.length < fltrItems.length) setConjunctions([...conjunctions, 'AND']);
    // {
    //   cnjctns.push('AND');
    //   setConjunctions(cnjctns);
    // }
    setFilterItems(fltrItems);
    // .map((matches, isMatch) => Object.keys(matches).map(attrib => {
    //   const attribValues = matches[attrib].values;
    //   const hasMany = attribValues.length > 1;
    //   const surround = matches[attrib].type === 'string' ? `'` : '';
    //   const joinStr = `${surround}, `;
    //   const operator = isMatch 
    //   ? hasMany ? 'IN' : '=' 
    //   : hasMany ? 'NOT IN' : '!=';
    //   const valuesStr = `${hasMany ? '(' : ''}${surround}${attribValues.join(joinStr)}${surround}${hasMany ? ')' : ''}`;
    //   return `${attrib} ${operator} ${valuesStr}`;
    // })).flat()
    
  }

  const updateOptionsSearchText = evt => {
    const searchText = evt.target.value;
    setOptionsSearchText(searchText);
    const searchRE = new RegExp(searchText, 'i');
    setOptionFilterMatch(options.map(o => searchRE.test(o.option)));
    setShowItemsList(true);
  }

  const updateSearchText = (evt, idx) => {
    const searchText = evt.target.value;
    const searches = [...searchTexts];
    searches[idx] = searchText;
    const searchRE = new RegExp(searchText, 'i');
    const vals = values.map((val, i) => i === idx ? val.map(v => ({...v, isIncluded: searchRE.test(v.display)})) : val);
    const shown = shownValues.map((show, i) => i === idx ? shownCount(includedValuesCount(vals[idx]), show) : show);
    setSearchTexts(searches);
    setValues(vals);
    setShownValues(shown);
  }

  const includedValuesCount = arr => arr.filter(val => val.isIncluded).length;

  const shownCount = (count, show = MIN_ITEMS_SHOWN) => count > Math.max(show, MIN_ITEMS_SHOWN) ? Math.max(show, MIN_ITEMS_SHOWN) : count;

  const optionClickHandler = idx => setDisplayOptions(displayOptions.map((d, i) => i === idx ? !d : d));

  const updateShownValues = (evt, idx) => {
    evt.preventDefault();
    const shown = [...shownValues];
    shown[idx] = values[idx].filter(val => val.isIncluded).length;
    setShownValues(shown);
  }

  const shownAndIncluded = (vals, idx) => [...vals].reduce((acc, cur) => cur.isIncluded && acc.length < shownValues[idx] ? [...acc, cur] : acc, []);

  const selectedValuesCounter = idx => {
    const count = selectedValuesCount(idx);
    if (count) return <span className="nrlabs-filter-bar-list-option-count">{count}</span>;
  }

  const selectedValuesCount = idx => values[idx].reduce((acc, val) => val.isSelected ? acc += 1 : acc, 0);

  const filterItemStr = item => {
    const attribValues = item.valueIndexes.map(valIdx => values[item.optionIndex][valIdx]['value']);
    const hasMany = attribValues.length > 1;
    const surround = item.type === 'string' ? `'` : '';
    const joinStr = `${surround}, `;
    // const operator = item.matchType 
    const operator = optionShouldMatch[item.optionIndex] 
    ? hasMany ? 'IN' : '=' 
    : hasMany ? 'NOT IN' : '!=';
    const valuesStr = `${hasMany ? '(' : ''}${surround}${attribValues.join(joinStr)}${surround}${hasMany ? ')' : ''}`;
    return `${item.attribute} ${operator} ${valuesStr}`;
  }

  const removeFilterItem = idx => {
    const fltrItems = [...filterItems];
    const cnjctns = [...conjunctions];
    const optIdx = fltrItems[idx]['optionIndex'];
    const vals = values.map((opt, i) => i === optIdx ? opt.map(val => ({...val, isSelected: false, shouldMatch: true})) : opt);
    fltrItems.splice(idx, 1);
    cnjctns.splice(idx, 1);
    // if (cnjctns.length > fltrItems.length/2) {
    //   const cnjIdx = idx ? idx - 1 : idx;
    //   cnjctns.splice(cnjIdx, 1);
    //   setConjunctions(cnjctns);
    // }
    setConjunctions(cnjctns);
    setFilterItems(fltrItems);
    setValues(vals);
  }

  const changeConjunction = (idx, operator) => setConjunctions(conjunctions.map((conj, i) => i === idx ? operator : conj));

  const changeMatchType = (idx, shouldMatch, evt) => {
    evt.stopPropagation();
    setOptionShouldMatch(optionShouldMatch.map((type, i) => i === idx ? shouldMatch : type));
  }
  // i < filterItems.length - 1 && conjunctions.length > Math.floor(i/2)
  // {filterItems.length !== 1 && i !== filterItems.length - 1 ? <Conjunction operator={conjunctions[i-1]} onChange={operator => changeConjunction(i-1, operator)} /> : ''}
  // 
  return (
    <div className="nrlabs-filter-bar" ref={thisComponent}>
      <div className="nrlabs-filter-bar-input-field" ref={inputField}>
        <div className="nrlabs-filter-bar-input-field-icon">
          <img src={FilterByIcon} alt="filter by" />
        </div>
        <div className={`nrlabs-filter-bar-input-field-input ${!filterItems.length ? 'placeholder' : ''}`} onClick={() => setShowItemsList(!showItemsList)}>
          {filterItems.map((item, i) => (
            <React.Fragment key={i}>
              <Label value={filterItemStr(item)} onRemove={() => removeFilterItem(i)} />
              <Conjunction operator={conjunctions[i]} isHint={i === (filterItems.length - 1)} onChange={operator => changeConjunction(i, operator)} />
            </React.Fragment>
          ))}
          <span className="nrlabs-filter-bar-input-field-search">
            <input type="text" className="u-unstyledInput" placeholder={!filterItems.length ? 'Filter by...' : ''} value={optionsSearchText} onChange={updateOptionsSearchText} />
          </span>
        </div>
      </div>
      {showItemsList
        ? (
          <div className="nrlabs-filter-bar-list" style={{width: dropdownWidth}}>
            {options.map((option, i) => optionFilterMatch[i] ? (
              <div className="nrlabs-filter-bar-list-options">
                <div className="nrlabs-filter-bar-list-option" onClick={() => optionClickHandler(i)}>
                  <img src={displayOptions[i] ? OpenIcon : CloseIcon} alt="show or hide options" />
                  <span>{option.option}</span>
                  {selectedValuesCounter(i)}
                  {displayOptions[i] ? (
                    <span className={`nrlabs-filter-bar-list-option-picker ${!selectedValuesCount(i) ? 'lighten' : ''}`}>
                      <span className={`equal ${optionShouldMatch[i] ? 'selected' : ''}`} onClick={evt => changeMatchType(i, true, evt)} />
                      <span className={`not-equal ${!optionShouldMatch[i] ? 'selected' : ''}`} onClick={evt => changeMatchType(i, false, evt)} />
                    </span>
                    ) : null}
                </div>
                {displayOptions[i] ? 
                <>
                <div className="nrlabs-filter-bar-list-option-search">
                  <img src={SearchIcon} alt="search options" />
                  <input type="text" style={{backgroundColor: '#FFF'}} value={searchTexts[i]} onChange={evt => updateSearchText(evt, i)} />
                </div>
                <div className="nrlabs-filter-bar-list-option-values">
                  {shownAndIncluded(values[i], i).map((value, j) => <Value value={value} width={checkboxWidth} optionIndex={i} valueIndex={j} onChange={checkHandler} />)}
                  {includedValuesCount(values[i]) > shownValues[i] ? (
                    <div className="nrlabs-filter-bar-list-option-value" style={{width: checkboxWidth}}>
                      <a onClick={evt => updateShownValues(evt, i)}>{`Show ${includedValuesCount(values[i]) - shownValues[i]} more...`}</a>
                    </div>
                  ) : null}
                </div>
                </> : null}
              </div>
            ) : null)}
          </div>
          )
        : null
      }
    </div>
  );
}

NRLabsFilterBar.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    option: PropTypes.string,
    info: PropTypes.string,
    values: PropTypes.array,
    group: PropTypes.string,
  })),
  filters: PropTypes.string,
  onChange: PropTypes.func,
};

export default NRLabsFilterBar;
