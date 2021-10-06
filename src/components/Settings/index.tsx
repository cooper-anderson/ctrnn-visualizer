import { Callout, FormGroup, Intent, Slider, Text } from "@blueprintjs/core";
import React from "react";
import { Node } from 'ctrnn.js';
import "./index.css";

export type Structure = {
  nodes: Node[],
  weights: number[][]
}

type SettingsProps = {
  onChangeNode: (id: number, node: Node) => void,
  onChangeWeight: (from: number, to: number, weight: number) => void,
  onChangeStepsize: (step: number) => void,
  stepsize: number,
  ctrnn: Structure
};

export class Settings extends React.Component<SettingsProps, {}> {
  render() {
    const colors = [Intent.PRIMARY, Intent.SUCCESS];
    const full = [[Intent.PRIMARY, Intent.DANGER], [Intent.WARNING, Intent.SUCCESS]];
    return <>
      <FormGroup
        label="Node Biases"
      >
        {this.props.ctrnn.nodes.map((node, id) =>
          <Slider key={id} value={node.bias}
            min={-16.0} max={16.0} stepSize={0.001}
            labelStepSize={4}
            intent={colors[id]}
            onChange={value => {
              this.props.onChangeNode(id,
                {timeConstant: node.timeConstant, bias: value}
              );
            }}
            />
        )}
      </FormGroup>
      <FormGroup
        label="Node Time Constants"
      >
        {this.props.ctrnn.nodes.map((node, id) =>
          <Slider key={id} value={node.timeConstant}
            min={0.5} max={10.0} stepSize={0.001}
            labelValues={[0.5, 2, 4, 6, 8, 10]}
            intent={colors[id]}
            onChange={value => {
              this.props.onChangeNode(id,
                {timeConstant: value, bias: node.bias}
              );
            }}
            />
        )}
      </FormGroup>
      {this.props.ctrnn.weights.map((weights, to) =>
        <FormGroup
          label={`Incoming weights to Node ${to}`}
        >
          {weights.map((weight, from) =>
            <Slider key={from + '-' + to} value={weight}
              labelStepSize={4} intent={full[from][to]}
              min={-16.0} max={16.0} stepSize={0.001}
              onChange={value => {
                this.props.onChangeWeight(from, to, value);
              }}
              />
          )}
        </FormGroup>
      )}
      <FormGroup label="Step size">
        <Slider min={0.01} max={1.0} stepSize={0.001} intent={Intent.WARNING}
          labelValues={[0.01, 0.25, 0.5, 0.75, 1]}
          value={this.props.stepsize} onChange={this.props.onChangeStepsize}/>
      </FormGroup>
      </>
  }
}
