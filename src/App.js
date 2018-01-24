import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

const searchTerm = '';

/** 
// ES5
this.state = {
  list: list,
  };
  // ES6
  this.state = {
  list,
  };

  // ES5
var userService = {
getUserName: function (user) {
return user.firstname + ' ' + user.lastname;
},
};
// ES6
const userService = {
getUserName(user) {
return user.firstname + ' ' + user.lastname;
},
};

// ES5
var user = {
name: 'Robin',
};
// ES6
const key = 'name';
const user = {
[key]: 'Robin',
};
  */

const isSearched = (searchTerm) => (item) =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    console.log('props:', props);
    console.log('state:', this.state);

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this); 
    this.onDismiss = this.onDismiss.bind(this);

  }

  setSearchTopStories(result){
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e)
  }
  onSearchChange(event) {
    console.log(event.target.value);
    this.setState({ searchTerm: event.target.value });
  }
  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });

    console.log('onDismiss', id);
  }

  componentDidMount(){
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const { searchTerm, result } = this.state;
    if (!result) {return null;}
    return (
      <div className="page">
      <div className="interactions">
        <Search searchTerm={searchTerm} onChange={this.onSearchChange}>
          Search:{' '}
        </Search>
        </div> 
        <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>

    );
  }
}

const Search = ({ value, onChange, children }) => (
  <form>
    {children} <input type="text" value={value} onChange={onChange} />
  </form>
);

const Table = ({ list, pattern, onDismiss }) => (
  <div className="table">
    {list.filter(isSearched(pattern)).map((item) => {
      return (
        <div key={item.objectID} className="table-row">
          <span style={{width: '40%'}}>
            <a href={item.author.url}>{item.title}</a>
          </span>
          <span style={{width: '30%'}}>{item.author}</span>
          <span style={{width: '10%'}}>{item.num_comments}</span>
          <span style={{width: '10%'}}>{item.points}</span>
          <Button onClick={() => onDismiss(item.objectID)} className="button-inline">Dismiss</Button>
        </div>
      );
    })}
  </div>
);

const Button = ({ onClick, className = '', children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

export default App;
