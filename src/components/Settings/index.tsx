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
  ctrnn: Structure
};

export class Settings extends React.Component<SettingsProps, {}> {
  render() {
    const colors = [Intent.PRIMARY, Intent.SUCCESS];
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
              labelStepSize={4} intent={colors[from]}
              min={-16.0} max={16.0} stepSize={0.001}
              onChange={value => {
                this.props.onChangeWeight(from, to, value);
              }}
              />
          )}
        </FormGroup>
      )}
      <Callout
        icon="help"
        title="Information"
      >
        <Text className="information">

        </Text>
      </Callout>
      </>
  }
}
