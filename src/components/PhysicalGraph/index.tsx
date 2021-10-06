import React from "react";
import "./index.css"

type Point = { x: number, y: number };
type PhysicalGraphProps = {
	a: Point[],
	b: Point[],
  margin: number,
};

export class PhysicalGraph extends React.Component<PhysicalGraphProps, {}> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private divRef: React.RefObject<HTMLDivElement>;

  constructor(props: PhysicalGraphProps) {
    super(props);
    this.canvasRef = React.createRef();
    this.divRef = React.createRef();
  }

  render() {
    const element = (
      <div ref={this.divRef} className="PhysicalGraph-div">
        <canvas ref={this.canvasRef}></canvas>
      </div>
    );

    this.draw();

    return element
  }

  draw() {
    const radius = 0.1;
    const arrow = 0.025;
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width, height = canvas.height;
    const size = Math.min(width, height) - 2 * this.props.margin;
    context.clearRect(0, 0, width, height);

    const origin = {x: (width - size) / 2, y: (height - size) / 2};
    context.translate(origin.x, origin.y);
    context.scale(size, size);
    context.lineWidth = 5.0 / size;

    context.beginPath()
    context.arc(0.25, 0.25, radius, 0, 2 * Math.PI);
    context.strokeStyle = "#137cbd";
    context.fillStyle = "#137cbd";
    context.globalAlpha = 1.0;
    context.stroke();
    context.globalAlpha = 0.5;
    context.fill()

    context.beginPath()
    context.arc(0.75, 0.75, radius, 0, 2 * Math.PI);
    context.strokeStyle = "#0f9960";
    context.fillStyle = "#0f9960";
    context.globalAlpha = 1.0;
    context.stroke();
    context.globalAlpha = 0.5;
    context.fill()

    context.lineWidth = 3.0 / size;
    context.beginPath()
    context.bezierCurveTo(0.25 + radius, 0.25, 0.75, 0.25, 0.75, 0.75 - radius);
    context.moveTo(0.25 + radius + arrow, 0.25 - arrow);
    context.lineTo(0.25 + radius, 0.25);
    context.lineTo(0.25 + radius + arrow, 0.25 + arrow);
    context.strokeStyle = "#d9822b";
    context.stroke()

    context.beginPath()
    context.bezierCurveTo(0.25, 0.25 + radius, 0.25, 0.75, 0.75 - radius, 0.75);
    context.moveTo(0.75 - radius - arrow, 0.75 - arrow);
    context.lineTo(0.75 - radius, 0.75);
    context.lineTo(0.75 - radius - arrow, 0.75 + arrow);
    context.strokeStyle = "#db3737";
    context.stroke()

    context.beginPath()
    context.arc(0.25 - radius, 0.25 - radius, radius, 0, Math.PI / 2, true);
    context.moveTo(0.25 - arrow, 0.25 - radius - arrow);
    context.lineTo(0.25, 0.25 - radius);
    context.lineTo(0.25 + arrow, 0.25 - radius - arrow);
    context.strokeStyle = "#137cbd";
    context.stroke()

    context.beginPath()
    context.arc(0.75 + radius, 0.75 + radius, radius, Math.PI, 3 * Math.PI / 2, true);
    context.moveTo(0.75 - arrow, 0.75 + radius + arrow);
    context.lineTo(0.75, 0.75 + radius);
    context.lineTo(0.75 + arrow, 0.75 + radius + arrow);
    context.strokeStyle = "#0f9960";
    context.stroke()

    context.resetTransform();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current!;
    const div = this.divRef.current!;
    const component = this;
    function resize() {
      canvas.width = div.clientWidth;
      canvas.height = div.clientHeight;
      canvas.style.width = canvas.width + "px";
      canvas.style.height = canvas.height + "px";
      component.draw();
    }
    window.addEventListener("resize", resize);
    resize();
  }
}
