import React from "react";
import { ForceGraph2D } from "react-force-graph";
import { SizeMe } from "react-sizeme";

const exampleData = {
  nodes:[
    {"id":"node1", "__label":"Julia"},
    {"id":"node2", "__label":"Bob"},
  ],
  links:[
    {"id":"link1", "source":"node1", "target":"node2"}
  ]
}

export class Network extends React.Component<{}, {}> {
  render() {
    return <SizeMe
      monitorHeight
      refreshRate={32}
    >{
      ({ size }) => <ForceGraph2D
        width={size.width || 100} height={size.height || 100}
        graphData={exampleData}
        />
      }</SizeMe>
  }
}
