import React, { Component } from "react";

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

  export default Search;
  