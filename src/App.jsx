import React, { Component } from 'react';

import debounce from './utils/debounce';
import Popup from './components/Popup/';

import './App.css';

export default class App extends Component {
  state = {
    search: '',
    list: null,
    loading: false,
    selected: false,
    selectedIndex: 0,
    openPopup: false,
    article: null,
    focused: false
  }

  clearPopup = () => {
    this.setState({
      openPopup: false,
      selected: false,
      selectedIndex: 0,
      list: null
    });
  }

  triggerAutocomplete = debounce((value) => {
    fetch(`/api/autocomplete?search=${value}`)
      .then((response) => {
        return response.json();
      })
      .then((list) => {
        this.setState({
          list
        });
      })
      .catch(err => {
        console.error(err);
      });
  }, 250);

  getFullItemByItem = (item) => {
    this.setState({
      loading: true,
      search: item.data,
      article: null
    });

    fetch(`/article/${item.id}`)
      .then((response) => {
        return response.json();
      })
      .then((article) => {
        this.setState({
          loading: false,
          article
        });
      })
      .catch(err => {
        console.error(err);
      });
    this.clearPopup();
  }

  handleItemClick = (index) => {
    const { list } = this.state;
    if (list && list[index]) {
      this.getFullItemByItem(list[index]);
    }
  }

  handleChange = (event) => {
    const search = event.currentTarget.value;
    this.setState({
      search,
      openPopup: !!search
    });
    if (search && search.length > 2) {
      this.triggerAutocomplete(search);
    } else {
      this.setState({
        list: null
      })
    }
  };

  handleKeyEvents = (event) => {
    const { list, selected, selectedIndex } = this.state;

    // console.log(event.keyCode);
    switch(event.keyCode) {
      // Arrow Up
      case 38:
        if (!list) return true;
        event.preventDefault();
        if (selected) {
          this.setState({
            selected: selectedIndex !== 0,
            selectedIndex: selectedIndex > 0
            ? selectedIndex - 1
            : 0
          });
        } else {
          this.setState({
            selected: true,
            selectedIndex: list.length - 1
          });
        }
      break;
      // Arrow Down
      case 40:
        if (!list) return true;
        event.preventDefault();
        if (selected) {
          this.setState({
            selected: selectedIndex !== ( list.length - 1 ),
            selectedIndex: selectedIndex < ( list.length - 1 )
            ? selectedIndex + 1
            : 0
          });
        } else {
          this.setState({
            selected: true,
            selectedIndex: 0
          });
        }
      break;
      // Tab and Enter keys
      case 13:
      case 9:
        if (!selected) return true;
        event.preventDefault();
        if (list && list[selectedIndex]) {
          this.getFullItemByItem(list[selectedIndex]);
        }
      break;
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { search, list, selected, selectedIndex } = this.state;

    if (selected && list && list[selectedIndex]) {
      this.getFullItemByItem(list[selectedIndex]);
    } else if (search) {
      this.getFullItemByString(search);
    } else {
      console.log('No data was provided');
    }
  }

  render() {
    const { loading, article, openPopup, focused, search, list, selected, selectedIndex } = this.state;
    return (
      <form className='wrapper' onSubmit={this.handleSubmit}>
        Please enter some value below:
        <input
          className='field'
          type='text'
          value={search}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyEvents}
          onFocus={() => {
            this.setState({
              focused: true
            })
          }}
          onBlur={() => {
            this.setState({
              focused: false
            })
          }} />
        {
          search.length > 2 && openPopup && <Popup
            search={search}
            list={list}
            selected={selected}
            selectedIndex={selectedIndex}
            handleClick={this.handleItemClick} />
        }
        <div className='article'>
          {
            loading && <span>Loading...</span>
          }
          {
            article && (<>
              <h3 className='article-title'>Title: {article.title}</h3>
              <span className='article-body'>{article.data}</span>
            </>)
          }
        </div>
      </form>
    );
  }
}
