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
            min={-3.0} max={3.0} stepSize={0.001}
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
            min={0.001} max={2.0} stepSize={0.001}
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
              labelStepSize={2.5} intent={colors[from]}
              min={-5.0} max={5.0} stepSize={0.001}
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
