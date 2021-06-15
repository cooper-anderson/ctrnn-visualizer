import React from 'react';
import './App.css';
import { Card, Elevation } from '@blueprintjs/core';
import { Settings, Structure } from './components/Settings';
import { Network } from './components/Network';
import { SineWave } from './components/SineWave';
import { CTRNN, Node } from 'ctrnn.js';

type Point = { x: number, y: number };
type AppState = {
  frame: number,
  ctrnn: Structure,
  data: { a: Point[], b: Point[] },
  fixed: { a: Point[], b: Point[] }
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    frame: 0,
    data: { a: [], b: [] },
    fixed: { a: [], b: [] },
    ctrnn: {
      nodes: [
        { bias: -2.75, timeConstant: 1.0 },
        { bias: -1.75, timeConstant: 1.0 },
      ],
      weights: [
        [4.5, 1.0],
        [-1.0, 4.5]
      ]
    }
  };
  private ctrnn: CTRNN = new CTRNN(2);
  private paused: boolean = false;

  updateNetwork(ctrnn: CTRNN) {
    this.state.ctrnn.nodes.forEach((node, index) => {
      ctrnn.setNode(index, node);
    });
    this.state.ctrnn.weights.forEach((weights, to) => {
      weights.forEach((weight, from) => {
        ctrnn.setWeight(from, to, weight);
      });
    });
  }

  componentDidMount() {
    this.updateNetwork(this.ctrnn);
    this.updateFixed();

    const size = 500;
    setInterval(() => {
      if (this.paused) return;
      this.ctrnn.tick([], 0.2);

      const outputs = this.ctrnn.outputs;
      const data = this.state.data;
      data.a.push({x: this.state.frame, y: outputs[0]});
      data.b.push({x: this.state.frame, y: outputs[1]});
      if (data.a.length > size) data.a.shift();
      if (data.b.length > size) data.b.shift();

      this.setState({ data: data, frame: this.state.frame + 1 });
    }, 5);
  }

  onClick() {
    this.paused = !this.paused;
  }

  onChangeNode(id: number, node: Node) {
    this.state.ctrnn.nodes[id] = node;
    this.ctrnn.setNode(id, node);
    this.updateFixed();
  }

  onChangeWeight(from: number, to: number, weight: number) {
    this.state.ctrnn.weights[to][from] = weight;
    this.ctrnn.setWeight(from, to, weight);
    this.updateFixed();
  }

  updateFixed() {
    let ctrnn = new CTRNN(2);
    this.updateNetwork(ctrnn);
    const data: { a: Point[], b: Point[] } = {a: [], b: []};
    for (let i = 0; i < 500; i++) {
      ctrnn.tick([], 0.2);
      if (i % 5 === 0) {
        const outputs = ctrnn.outputs;
        data.a.push({x: i, y: outputs[0]});
        data.b.push({x: i, y: outputs[1]});
      }
    }
    this.setState({fixed: data});
  }

  render() {
    return (
      <div className="App">
        <div className="Dashboard">
          <div className="Settings">
            <Card elevation={Elevation.ZERO}>
              <Settings
                ctrnn={this.state.ctrnn}
                onChangeNode={this.onChangeNode.bind(this)}
                onChangeWeight={this.onChangeWeight.bind(this)}
              />
            </Card>
          </div>
          <div className="Network">
            <Card elevation={Elevation.ZERO}>
              <Network />
            </Card>
          </div>
          <div className="SineWaveLive" onClick={this.onClick.bind(this)}>
            <Card elevation={Elevation.ZERO}>
              <SineWave a={this.state.data.a} b={this.state.data.b} />
            </Card>
          </div>
          <div className="SineWave">
            <Card elevation={Elevation.ZERO}>
              <SineWave a={this.state.fixed.a} b={this.state.fixed.b} />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
