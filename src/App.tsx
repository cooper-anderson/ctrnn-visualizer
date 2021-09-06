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
  points: number[][],
  stepsize: number
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    frame: 0,
    data: { a: [], b: [] },
    fixed: { a: [], b: [] },
    phaseData: [],
    points: [],
    stepsize: 0.1,
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
  private start: number[] = [0.05, 0.15];
  private animating: boolean = false;

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

  onChangeStart(point: Point) {
    const app = this;
    const old = this.start;
    const offset = [point.x - old[0], point.y - old[1]];
    const dist = Math.hypot(offset[0], offset[1]);
    const duration = Math.max(Math.round(dist * 25), 5);
    let t = 1;
    if (this.animating) return;
    this.animating = true;
    function animate() {
      const p = Math.pow(t / duration, 2);
      app.start = [old[0] + offset[0] * p, old[1] + offset[1] * p];
      app.update();
      if (t++ < duration) requestAnimationFrame(animate);
      else app.animating = false;
    }
    requestAnimationFrame(animate);
  }

  onChangeStepsize(value: number) {
    this.setState({stepsize: value});
    this.update();
  }

  updateFixed() {
    let ctrnn = new Ctrnn(2);
    this.updateNetwork(ctrnn);
    const data: { a: Point[], b: Point[] } = {a: [], b: []};
    const points: number[][] = [];
    let frame = ctrnn.frameFromOutput(this.start);
    const initial = ctrnn.getOutputs(frame);
    data.a.push({x: 0, y: initial[0]});
    data.b.push({x: 0, y: initial[1]});
    points.push(initial);
    let last_x = 0, s = this.state.stepsize;
    for (let i = s; i <= 30; i += s) {
      frame = ctrnn.tick(frame, [], this.state.stepsize);
      const outputs = ctrnn.getOutputs(frame);
      const x = Math.floor(i * 100) / 100;
      if (x > last_x) {
        last_x = x;
        data.a.push({x: x, y: outputs[0]});
        data.b.push({x: x, y: outputs[1]});
        points.push(outputs);
      }
    }

    frame = ctrnn.tick(frame, [], this.state.stepsize);
    const last = [data.a[data.a.length - 1], data.b[data.b.length - 1]];
    const outputs = ctrnn.getOutputs(frame);
    const next = []
    const left = (30 - last_x) / s;
    console.log(left);
    for (let i = 0; i < frame.length; i++) {
      console.log(last[i].x, outputs[i]);
      next.push(last[i].y + (outputs[i] - last[i].y) * left);
    }
    data.a.push({x: 30, y: next[0]});
    data.b.push({x: 30, y: next[1]});
    points.push(outputs);

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
        const frame = ctrnn.tick(biased, [], this.state.stepsize);
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
                onChangeStepsize={this.onChangeStepsize.bind(this)}
                stepsize={this.state.stepsize}
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
                points={this.state.points}
                onChangeStart={this.onChangeStart.bind(this)} />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
