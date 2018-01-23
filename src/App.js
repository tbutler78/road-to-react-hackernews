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
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: list
    };
    console.log('props:', props);
    console.log('state:', this.state);

    this.onDismiss= this.onDismiss.bind(this)
  }

  onDismiss(id){
    const isNotId = item => item.objectID != id
    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
    
  
    console.log('onDismiss', id);
  }


  render() {
    return (
      <div className="App">
        {this.state.list.map((item) => (
          <div key={item.objectID}>
            <span>
              <a href={item.author.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <button onClick={() => this.onDismiss(item.objectID)} type="button">Dismiss</button>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
