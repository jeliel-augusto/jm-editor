import React from 'react';
import {TextEditor} from "./components";
import MathJax from 'react-mathjax2'

const ascii = 'U = 1/(R_(si) + sum_(i=1)^n(s_n/lambda_n) + R_(se))'

function App() {
  return (
    <div className="App" style={{'marginTop': '50px'}}>
      <TextEditor/>

    </div>
  );
}

export default App;
