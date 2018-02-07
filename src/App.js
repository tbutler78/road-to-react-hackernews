import React, { Component } from 'react';
import './App.css';
import fetch from 'isomorphic-fetch';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Table from './components/Table';
import {DEFAULT_QUERY, PATH_BASE, PATH_SEARCH, PARAM_HPP, PARAM_PAGE, PARAM_SEARCH, DEFAULT_HPP} from './Constants';

const Loading = () => <div>Loading...</div>;

const SORTS = {
  NONE: (list) => list, 
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENTS: (list) => sortBy(list, 'num_comments').reverse(),
  POINTS: (list) => sortBy(list, 'points').reverse()
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
   const {searchKey, results} = prevState;

  const oldHits =
  results && results[searchKey] ? results[searchKey].hits : [];

  const updatedHits = [
    ...oldHits,
    ...hits
  ];

return {
  results: {
    ...results,
    [searchKey]: {
      hits: updatedHits,
      page
    }
  },
  isLoading: false
};
};

class App extends Component {
  // Constructor & initial state
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }


  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((e) => this.setState({ error: e }));
  }
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault(); // suppress native browser behavior
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;

    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
      // result: Object.assign({}, this.state.result, {hits: updatedHits})
    });

    console.log('onDismiss', id);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });
    this.fetchSearchTopStories(searchTerm);
  }

  render() {

    const { searchTerm, results, searchKey, error, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    // Simple higher-order-component
    // Destructure by using function to exclude, ...rest instead of all via (...props)
    const withLoading = (Component) => ({ isLoading, ...rest }) =>
      isLoading ? <Loading /> : <Component {...rest} />;

    // Enhanced output component
    const ButtonWithLoading = withLoading(Button);
    /** Alternative conditional rendering methods
    { result && <Table />}
    if (!result) {
      return null;
    }

      if (error){
      return <p>Something went wrong.</p>;
    }
    */

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search:
          </Search>
        </div>

        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

/* functional stateless component, before
* refactoring to ES6 class component
const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      ref={(node) => {this.intput = node;}} />
    <button type="submit"> {children} </button>
  </form>
);
*/

class Search extends Component {
  /**
   * this object of ES6 class component allows referencing
   * DOM node with ref attribute
   * focus on input field when component is mounted
   *
   * For stateless component (no this), use
   * let input;
   * <input... ref={(node) => input = node }
   */
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => {
            this.input = node;
          }}
        />
        <button type="submit"> {children} </button>
      </form>
    );
  }
}
const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames('button-inline', {
    'button-active': sortKey === activeSortKey
  });

  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};



const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

Button.defaultProps = {
  className: ''
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default App;

export { Button, Search, Table, SORTS, Sort};
