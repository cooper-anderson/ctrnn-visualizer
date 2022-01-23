import type { VisualizationSpec } from "vega-embed";

export default {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  description: "A re-orderable adjacency matrix.",
  width: 770,
  height: 770,
  padding: 2,

  signals: [
    { name: "cellSize", value: 40 },
    { name: "count", update: "length(data('nodes'))" },
    { name: "width", update: "span(range('position'))" },
    { name: "height", update: "width" },
    {
      name: "src", value: {},
      on: [
        { events: "text:mousedown", update: "datum" },
        { events: "window:mouseup", update: "{}" }
      ]
    },
    {
      name: "dest", value: -1,
      on: [
        {
          events: "[@columns:mousedown, window:mouseup] > window:mousemove",
          update: "src.name && datum !== src ? (0.5 + count * clamp(x(), 0, width) / width) : dest"
        },
        {
          events: "[@rows:mousedown, window:mouseup] > window:mousemove",
          update: "src.name && datum !== src ? (0.5 + count * clamp(y(), 0, height) / height) : dest"
        },
        { events: "window:mouseup", update: "-1" }
      ]
    }
  ],

  data: [
    {
      name: "nodes",
      format: { type: "json", property: "nodes" },
      transform: [
        {
          type: "formula", as: "order",
          expr: "datum.group"
        },
        {
          type: "formula", as: "score",
          expr: "dest >= 0 && datum === src ? dest : datum.order"
        },
        {
          type: "window", sort: { field: "score" },
          ops: ["row_number"], as: ["order"]
        }
      ]
    },
    {
      name: "edges",
      format: { type: "json", property: "links" },
      transform: [
        {
          type: "lookup", from: "nodes", key: "index",
          fields: ["source", "target"], as: ["sourceNode", "targetNode"]
        },
        {
          type: "formula", as: "group",
          expr: "datum.sourceNode.group === datum.targetNode.group ? datum.sourceNode.group : count"
        }
      ]
    },
    {
      name: "cross",
      source: "nodes",
      transform: [
        { type: "cross" }
      ]
    }
  ],

  scales: [
    {
      name: "position",
      type: "band",
      domain: { data: "nodes", field: "order", sort: true },
      range: { step: {signal: "cellSize"} }
    },
    {
      name: "color",
      type: "linear",
      domain: [-1, 1],
      range: { scheme: "redblue" }
    }
  ],

  marks: [
    {
      type: "rect",
      from: { data: "cross" },
      encode: {
        update: {
          x: { scale: "position", field: "a.order" },
          y: { scale: "position", field: "b.order" },
          width: { scale: "position", band: 1, offset: -1 },
          height: { scale: "position", band: 1, offset: -1 },
          fill: [
            { test: "datum.a === src || datum.b === src", value: "#3c3c3c" },
            { value: "#1b1b1b" }
          ]
        }
      }
    },
    {
      type: "rect",
      from: { data: "edges" },
      encode: {
        update: {
          x: { scale: "position", field: "sourceNode.order" },
          y: { scale: "position", field: "targetNode.order" },
          width: { scale: "position", band: 1, offset: -1 },
          height: { scale: "position", band: 1, offset: -1 },
          fill: { scale: "color", field: "value" },
          fillOpacity: {field: "opacity"}
        }
      }
    },
    {
      type: "text",
      name: "columns",
      from: { data: "nodes" },
      encode: {
        update: {
          x: { scale: "position", field: "order", band: 0.5 },
          y: { offset: -5 },
          text: { field: "name" },
          fontSize: { value: 18 },
          align: { value: "center" },
          baseline: { value: "bottom" },
          fill: [
            { test: "datum === src", value: "steelblue" },
            { value: "white" }
          ]
        }
      }
    },
    {
      type: "text",
      name: "rows",
      from: { data: "nodes" },
      encode: {
        update: {
          x: { offset: -5 },
          y: { scale: "position", field: "order", band: 0.5 },
          text: { field: "name" },
          fontSize: { value: 18 },
          align: { value: "right" },
          baseline: { value: "middle" },
          fill: [
            { test: "datum === src", value: "steelblue" },
            { value: "white" }
          ]
        }
      }
    }
  ]
} as VisualizationSpec;
