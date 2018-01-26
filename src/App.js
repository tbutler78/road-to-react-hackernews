import React, { Component } from 'react';
import './App.css';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
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
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];

    // Save updated hits and page in a results map (by searchKey)
    this.setState({
      results: {
        ...results,
        [searchKey]: {
          hits: updatedHits,
          page
        }
      }
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((e) => this.setState({error: e}));
  }
  onSearchChange(event) {
    console.log(event.target.value);
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
    const { searchTerm, results, searchKey, error } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

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

        { error ?
           <div className="interactions"><p>Something went wrong.</p></div>
           :
        <Table list={list} onDismiss={this.onDismiss} />
        }
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </Button>
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
  componentDidMount(){
    if (this.input){
      this.input.focus();
    }
  }
  render() {
    const {
      value, onChange, onSubmit, children
    } = this.props;

    return (
    <form onSubmit={onSubmit}>
      <input 
        type="text"
         value={value} 
         onChange={onChange} 
         ref={(node) => {this.input = node;}}/>
      <button type="submit"> {children} </button>
    </form>
    )
  }
}

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map((item) => {
      return (
        <div key={item.objectID} className="table-row">
          <span
            style={{
              width: '40%'
            }}
          >
            <a href={item.author.url}> {item.title} </a>
          </span>
          <span
            style={{
              width: '30%'
            }}
          >
            
            {item.author}
          </span>
          <span
            style={{
              width: '10%'
            }}
          >
            
            {item.num_comments}
          </span>
          <span
            style={{
              width: '10%'
            }}
          >
            
            {item.points}
          </span>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </div>
      );
    })}
  </div>
);

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    
    {children}
  </button>
);

Button.defaultProps = {
  className: ''
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default App;

export {
  Button,
  Search,
  Table
}
