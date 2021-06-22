import React from "react"
import "./index.css"

type PhasePortaitProps = {
  data: number[][][],
  points: number[][],
  margin: number
};

export class PhasePortrait extends React.Component<PhasePortaitProps, {}> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private divRef: React.RefObject<HTMLDivElement>;

  constructor(props: PhasePortaitProps) {
    super(props);
    this.canvasRef = React.createRef();
    this.divRef = React.createRef();
  }

  render() {
    const element = (
      <div ref={this.divRef} className="PhasePortrait-div">
        <canvas ref={this.canvasRef}></canvas>
      </div>
    );

    this.draw();

    return element
  }

  draw() {
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

    context.lineWidth = 1.0 / size;
    context.beginPath();
    for (let t = 0; t < 1; t += 0.1) {
      context.moveTo(0, t);
      context.lineTo(1, t);
      context.moveTo(t, 0);
      context.lineTo(t, 1);
    }
    context.strokeStyle = "#141414";
    context.stroke();

    context.beginPath();
    this.props.data.forEach((row, y) => {
      row.forEach((point, x) => {
        let h = (20 - y) / 20;
        context.moveTo(x / 20, h);
        context.lineTo(x / 20 + point[0] / 40, h - point[1] / 40);
      });
    });
    context.strokeStyle = "#808080";
    context.stroke();

    if (this.props.points.length) {
      context.beginPath();
      let pos = this.props.points[0];
      context.moveTo(pos[0], pos[1]);
      for (const point of this.props.points) {
        context.lineTo(point[0], point[1]);
      }
      context.strokeStyle = "#d9822b";
      context.stroke();
    }

    context.resetTransform();

    context.lineWidth = 0.5;
    context.translate(origin.x, origin.y);
    const y = {x: -25, y: 5};
    const x = {x: -8, y: 15};
    for (let t = 0; t < 1.0; t += 0.1) {
      const p = t.toFixed(1).toString();
      context.strokeStyle = "#0f9960";
      context.strokeText(p, y.x, y.y + (1-t) * size);
      context.strokeStyle = "#137cbd";
      context.strokeText(p, x.x + t * size, x.y + size);
    }

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
