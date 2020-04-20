import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Popup.css';

function getHighlight(str, val) {
  let search = str;
  let index = val.indexOf(search);
  // Hack to highlight string with space for simple BE autocomplete
  if (index === -1) index = val.indexOf(search.split(' ').filter(item => item).join(' '));
  if (index === -1) return val;
  return (<>
    {val.slice(0, index)}
    <span className='popup__highlight'>{val.slice(index, index + search.length)}</span>
    {val.slice(index + search.length)}
  </>);
}

class Popup extends Component {
  render() {
    const { search, list, selected, selectedIndex, handleClick } = this.props;

    return (
      <div style={{
          display: list && list.length
          ? 'flex'
          : 'none'
        }} className='popup__wrapper'>
        {
          list && list.map((item, index) => (
            <p
              key={index}
              className={selected && selectedIndex === index ? 'popup__item popup__item--selected' : 'popup__item'}
              onClick={() => {
                handleClick(index);
              }}
              >
              {getHighlight(search, item.data)}
            </p>
          ))
        }
      </div>
    );
  }
}

Popup.propTypes = {
  search: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    data: PropTypes.string.isRequired
  })),
  selected: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Popup;
