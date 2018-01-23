import React, { Component } from 'react';
import './App.css';

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

  const isSearched = searchTerm => item =>
     item.title.toLowerCase().includes(searchTerm.toLowerCase());
    
  
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: list,
      searchTerm: searchTerm
    };
    console.log('props:', props);
    console.log('state:', this.state);

  this.onDismiss = this.onDismiss.bind(this);
   this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value})
  }
  onDismiss(id){
    const isNotId = item => item.objectID !== id
    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
    
  
    console.log('onDismiss', id);
  }


  render() {
    return (
      <div className="App">
        <form>
          <input type="text" onChange={this.onSearchChange}/>
        </form>
        {this.state.list.filter(isSearched(this.state.searchTerm)).map(item => {

                 return(
          <div key={item.objectID}>
            <span>
              <a href={item.author.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <button onClick={() => this.onDismiss(item.objectID)} type="button">Dismiss</button>
          </div>
         )
        })}
      </div>
    );
  }
}

export default App;
