import React from 'react';
import './App.css';
import { Card, Elevation } from '@blueprintjs/core';
import { Settings, Structure } from './components/Settings';
import { Network } from './components/Network';
import { SineWave } from './components/SineWave';
import { Ctrnn, Node } from 'ctrnn.js';
import { PhasePortrait } from './components/PhasePortrait';
import { getField } from "./sigmoid";

const field = getField();

type Point = { x: number, y: number };
type AppState = {
  frame: number,
  ctrnn: Structure,
  data: { a: Point[], b: Point[] },
  fixed: { a: Point[], b: Point[] },
  phaseData: number[][][],
  points: number[][]
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    frame: 0,
    data: { a: [], b: [] },
    fixed: { a: [], b: [] },
    phaseData: [],
    points: [],
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
  private ctrnn: Ctrnn = new Ctrnn(2);
  private paused: boolean = false;

  updateNetwork(ctrnn: Ctrnn) {
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
    this.update();
  }

  onClick() {
    this.paused = !this.paused;
  }

  onChangeNode(id: number, node: Node) {
    this.state.ctrnn.nodes[id] = node;
    this.ctrnn.setNode(id, node);
    this.update();
  }

  onChangeWeight(from: number, to: number, weight: number) {
    this.state.ctrnn.weights[to][from] = weight;
    this.ctrnn.setWeight(from, to, weight);
    this.update();
  }

  updateFixed() {
    let ctrnn = new Ctrnn(2);
    this.updateNetwork(ctrnn);
    const data: { a: Point[], b: Point[] } = {a: [], b: []};
    const points: number[][] = [];
    let frame = [0, 0];
    for (let i = 0; i < 500; i++) {
      frame = ctrnn.tick(frame, [], 0.2);
      if (i % 5 === 0) {
        const outputs = ctrnn.getOutputs(frame);
        data.a.push({x: i, y: outputs[0]});
        data.b.push({x: i, y: outputs[1]});
        points.push(outputs);
      }
    }
    this.setState({fixed: data, points: points});
  }

  updatePhase() {
    let ctrnn = new Ctrnn(2);
    this.updateNetwork(ctrnn);
    const data: number[][][] = [];
    field.forEach((row, y) => {
      const line: number[][] = [];
      row.forEach((point, x) => {
        const biased = [
          point[0] - this.state.ctrnn.nodes[0].bias,
          point[1] - this.state.ctrnn.nodes[1].bias
        ];
        const control = ctrnn.getOutputs(biased);
        const frame = ctrnn.tick(biased, [], 0.2);
        const outputs = ctrnn.getOutputs(frame);
        const diff = [outputs[0] - control[0], outputs[1] - control[1]];
        const mag = Math.hypot(diff[0], diff[1]);
        // const sqr = Math.sqrt(mag);
        line.push([diff[0] / mag, diff[1] / mag]);
      });
      data.push(line);
    });
    this.setState({phaseData: data});
  }

  update() {
    this.updateFixed();
    this.updatePhase();
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
          <div className="SineWave">
            <Card elevation={Elevation.ZERO}>
              <SineWave a={this.state.fixed.a} b={this.state.fixed.b} />
            </Card>
          </div>
          <div className="PhasePortrait">
            <Card elevation={Elevation.ZERO}>
              <PhasePortrait margin={15} data={this.state.phaseData}
                points={this.state.points} />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
