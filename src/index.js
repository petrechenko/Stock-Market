import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      diff: [],
      items: [],
      name: [],
      stocks: ["AAPL", "FB", "SBUX", "NKE", "NFLX", "DAL", "ALK", "LUV", "EXPE", "MAR"]
    };
  }

  componentDidMount() {
    const { stocks } = this.state;
    stocks.map(item => {
      this.loadCommitHistory(item);
    });
  }

  loadCommitHistory(stock) {
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${stock}&token=bpv28t7rh5rabkt30r7g`
    )
      .then(res => res.json())
      .then(
        result => {
          this.setState(state => {
            const items = state.items.concat(result);
            const name = state.name.concat(stock);
            return {
              items,
              name,
              result: "",
              isLoaded: true
            };
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  possibility(curr, low) {
    const res = (((curr - low) * 100) / curr).toFixed(2);
    return (res)
  }

  render() {
    const { error, isLoaded, items, name } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
        {items.map((val, index) => (<ul>
          <h4>{name[index]}:</h4>Current: {val.c}, Lowest: {val.l}, Highest: {val.h}, <div className={this.possibility(val.c, val.l) >2 ? "red":"green"}>Difference: {this.possibility(val.c, val.l)}%</div>
        </ul>))}
        </div>
      );
    }
  }
}


const rootElement = document.getElementById("root");
ReactDOM.render(<MyComponent />, rootElement);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();