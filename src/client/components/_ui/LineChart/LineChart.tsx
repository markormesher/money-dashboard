import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { PureComponent, ReactNode, RefObject } from "react";
import { combine } from "../../../helpers/style-helpers";
import * as style from "./LineChart.scss";

// exported interfaces

interface ILineChartAxisProperties {
  readonly valueRenderer?: (value: number) => string;
  readonly forcedValues?: number[];
  readonly axisLabelClass?: string;
  readonly approxTickCount?: number;
  readonly forceAxisRangeToBeExact?: boolean;
}

interface ILineChartProps {
  readonly series: ILineChartSeries[];
  readonly xAxisProperties?: ILineChartAxisProperties;
  readonly yAxisProperties?: ILineChartAxisProperties;
  readonly svgClass?: string;
  readonly gridLineClass?: string;
}

interface ILineChartSeries {
  readonly label: string;
  readonly strokeClass?: string;
  readonly fillClass?: string;
  readonly fillEnabled?: boolean;
  readonly dataPoints: ILineChartDataPoint[];
}

interface ILineChartDataPoint {
  readonly x: number;
  readonly y: number;
}

// internal interfaces

interface ILineChartState {
  readonly triggerRender: number;
}

interface ILineChartDrawingBounds {
  readonly totalWidth: number;
  readonly totalHeight: number;
  readonly topGutter: number;
  readonly bottomGutter: number;
  readonly leftGutter: number;
  readonly rightGutter: number;
  readonly chartAreaWidth: number;
  readonly chartAreaHeight: number;
  readonly xAxisLabelMockBounds: DOMRect[];
  readonly yAxisLabelMockBounds: DOMRect[];
  readonly xOffsetFromLeft: number;
  readonly yOffsetFromTop: number;
}

interface ILineChartExtents {
  readonly minXValue: number;
  readonly maxXValue: number;
  readonly minYValue: number;
  readonly maxYValue: number;
  readonly xAxisTickValues: ILineChartAxisTickValues;
  readonly yAxisTickValues: ILineChartAxisTickValues;
}

interface ILineChartAxisTickValues {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly values: number[];
}

class LineChart extends PureComponent<ILineChartProps, ILineChartState> {
  private svgRef: RefObject<SVGSVGElement>;

  private windowResizeDebounceTimeout: NodeJS.Timer;

  private drawingBounds: ILineChartDrawingBounds = null;
  private extents: ILineChartExtents = null;

  private gridLineBleed = 5;
  private axisLabelMargin = 3;
  private approxPxPerXAxisTick = 80;
  private approxPxPerYAxisTick = 30;

  constructor(props: ILineChartProps) {
    super(props);
    this.state = {
      triggerRender: 0,
    };

    this.svgRef = React.createRef();

    this.handleResize = this.handleResize.bind(this);

    this.getTotalSvgSize = this.getTotalSvgSize.bind(this);
    this.calculateExtents = this.calculateExtents.bind(this);
    this.calculateDrawingBounds = this.calculateDrawingBounds.bind(this);
    this.convertDataPointToPixelCoord = this.convertDataPointToPixelCoord.bind(this);

    this.triggerRerender = this.triggerRerender.bind(this);
    this.renderGridLines = this.renderGridLines.bind(this);
    this.renderAxisLabels = this.renderAxisLabels.bind(this);
    this.renderSeriesPath = this.renderSeriesPath.bind(this);
  }

  public componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
    global.setTimeout(this.triggerRerender, 100);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  private handleResize(): void {
    global.clearTimeout(this.windowResizeDebounceTimeout);
    this.windowResizeDebounceTimeout = global.setTimeout(this.triggerRerender, 100);
  }

  private triggerRerender(): void {
    this.setState({ triggerRender: Math.random() });
  }

  private static calculateAxisTickValues(
    min: number,
    max: number,
    targetStepCount = 10,
    simple = false,
  ): ILineChartAxisTickValues {
    if (max < min) {
      throw new Error(`Invalid axis range: min = ${min}; max = ${max}`);
    }

    if (max === min) {
      max += 1;
      min -= 1;
    }

    const generateTickValues = (min: number, max: number, step: number): number[] => {
      const output: number[] = [];
      const stepCount = Math.ceil((max - min) / step) + 1;
      for (let i = 0; i < stepCount; ++i) {
        output.push(min + step * i);
      }
      return output;
    };

    const range = max - min;
    const roughStep = range / (targetStepCount - 1);

    if (simple) {
      return {
        min,
        max,
        step: roughStep,
        values: generateTickValues(min, max, roughStep),
      };
    }

    const goodNormalisedSteps = [1, 1.5, 2, 2.5, 5, 7.5, 10];

    const stepMagnitude = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
    const normalisedStep = roughStep * stepMagnitude;
    const goodNormalisedStep = goodNormalisedSteps.filter((s) => s >= normalisedStep)[0];
    const step = goodNormalisedStep / stepMagnitude;

    const axisMax = Math.ceil(max / step) * step;
    const axisMin = Math.floor(min / step) * step;

    return {
      max: axisMax,
      min: axisMin,
      step,
      values: generateTickValues(axisMin, axisMax, step),
    };
  }

  private calculateExtents(): void {
    const { series, xAxisProperties, yAxisProperties } = this.props;

    const allDataPoints: ILineChartDataPoint[] = [];
    series.forEach((s) => allDataPoints.push(...s.dataPoints));

    let minXValue = allDataPoints.length ? Math.min(...allDataPoints.map((d) => d.x)) : 0;
    let maxXValue = allDataPoints.length ? Math.max(...allDataPoints.map((d) => d.x)) : 1;
    let minYValue = allDataPoints.length ? Math.min(...allDataPoints.map((d) => d.y)) : 0;
    let maxYValue = allDataPoints.length ? Math.max(...allDataPoints.map((d) => d.y)) : 1;

    if (xAxisProperties?.forcedValues?.length) {
      maxXValue = Math.max(maxXValue, ...xAxisProperties.forcedValues);
      minXValue = Math.min(minXValue, ...xAxisProperties.forcedValues);
    }

    if (yAxisProperties?.forcedValues?.length) {
      maxYValue = Math.max(maxYValue, ...yAxisProperties.forcedValues);
      minYValue = Math.min(minYValue, ...yAxisProperties.forcedValues);
    }

    // note: total size is used below rather than chart area size to estimate tick count because the chart area isn't
    // known until ticks are created

    const xAxisTickValues = LineChart.calculateAxisTickValues(
      minXValue,
      maxXValue,
      xAxisProperties.approxTickCount ||
        Math.max(2, Math.floor(this.getTotalSvgSize().totalWidth / this.approxPxPerXAxisTick) - 1),
      xAxisProperties.forceAxisRangeToBeExact,
    );
    const yAxisTickValues = LineChart.calculateAxisTickValues(
      minYValue,
      maxYValue,
      yAxisProperties.approxTickCount ||
        Math.max(2, Math.floor(this.getTotalSvgSize().totalHeight / this.approxPxPerYAxisTick) - 1),
      yAxisProperties.forceAxisRangeToBeExact,
    );

    this.extents = {
      minXValue,
      maxXValue,
      minYValue,
      maxYValue,
      xAxisTickValues,
      yAxisTickValues,
    };
  }

  private getTotalSvgSize(): { totalWidth: number; totalHeight: number } {
    const totalWidth = this.svgRef.current?.width.baseVal.value || 0;
    const totalHeight = this.svgRef.current?.height.baseVal.value || 0;
    return { totalWidth, totalHeight };
  }

  private calculateDrawingBounds(): void {
    const { totalWidth, totalHeight } = this.getTotalSvgSize();

    const matrixXY = (m: DOMMatrix, x: number, y: number): { x: number; y: number } => {
      return {
        x: x * m.a + y * m.c + m.e,
        y: x * m.b + y * m.d + m.f,
      };
    };

    const getTransformedBBox = (el: SVGGraphicsElement): DOMRect => {
      const matrix = el.getCTM();
      const bounds = el.getBBox();
      const transformedPoints = [
        matrixXY(matrix, bounds.x, bounds.y),
        matrixXY(matrix, bounds.x + bounds.width, bounds.y),
        matrixXY(matrix, bounds.x + bounds.width, bounds.y + bounds.height),
        matrixXY(matrix, bounds.x, bounds.y + bounds.height),
      ];
      const maxX = Math.max(...transformedPoints.map((p) => p.x));
      const minX = Math.min(...transformedPoints.map((p) => p.x));
      const maxY = Math.max(...transformedPoints.map((p) => p.y));
      const minY = Math.min(...transformedPoints.map((p) => p.y));
      return new DOMRect(minX, minY, maxX - minX, maxY - minY);
    };

    const xAxisLabelMockBounds: DOMRect[] = [];
    const yAxisLabelMockBounds: DOMRect[] = [];

    const mockHolder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mockHolder.setAttribute("class", style.svgMock);
    document.body.append(mockHolder);

    mockHolder.innerHTML = ReactDOMServer.renderToStaticMarkup(<>{this.renderAxisLabels("x", true)}</>);
    let mockHolderChildren = mockHolder.children;
    for (let i = 0; i < mockHolderChildren.length; ++i) {
      xAxisLabelMockBounds.push(getTransformedBBox(mockHolderChildren.item(i) as SVGTextElement));
    }

    mockHolder.innerHTML = ReactDOMServer.renderToStaticMarkup(<>{this.renderAxisLabels("y", true)}</>);
    mockHolderChildren = mockHolder.children;
    for (let i = 0; i < mockHolderChildren.length; ++i) {
      yAxisLabelMockBounds.push(mockHolderChildren.item(i).getBoundingClientRect());
    }

    document.body.removeChild(mockHolder);

    const firstXAxisLabelWidth = xAxisLabelMockBounds.length ? xAxisLabelMockBounds[0].width : 0;
    const firstXAxisLabelRotationSpill = xAxisLabelMockBounds.length ? xAxisLabelMockBounds[0].left * -1 : 0;
    const maxXAxisLabelHeight = Math.max(0, ...xAxisLabelMockBounds.map((b) => b.height));
    const maxXAxisLabelRotationSpill = -1 * Math.min(0, ...xAxisLabelMockBounds.map((b) => b.left));
    const maxYAxisLabelWidth = Math.max(0, ...yAxisLabelMockBounds.map((b) => b.width));
    const maxYAxisLabelHeight = Math.max(0, ...yAxisLabelMockBounds.map((b) => b.height));

    // the top y-axis label is vertically centred with the top grid line, so we need half of
    // its height in the top gutter so the top half of the text is visible
    const topGutter = maxYAxisLabelHeight * 0.5;

    // the bottom gutter needs to fit the tallest x-axis label plus the margin applied, minus the spill
    // amount they are shifted up by
    const bottomGutter = maxXAxisLabelHeight + this.axisLabelMargin - maxXAxisLabelRotationSpill;

    // on the left we need room for the larger of:
    // - the widest y-axis label plus its margin
    // - the first x-axis label width, minus its rotation spill and the grid line bleed because
    //   it is positioned relative to the x-coord of the y-axis, i.e. to the right of the y-axis bleeds
    const leftGutter = Math.max(
      maxYAxisLabelWidth + this.axisLabelMargin,
      firstXAxisLabelWidth - firstXAxisLabelRotationSpill - this.gridLineBleed,
    );

    // x-axis labels are shifted right by half of their rotated height relative to their grid
    // lines, so we need a gutter of that width to avoid clipping the text
    const rightGutter = maxXAxisLabelRotationSpill;

    this.drawingBounds = {
      totalWidth,
      totalHeight,
      topGutter,
      bottomGutter,
      leftGutter,
      rightGutter,
      xAxisLabelMockBounds,
      yAxisLabelMockBounds,
      chartAreaWidth: totalWidth - leftGutter - rightGutter - this.gridLineBleed,
      chartAreaHeight: totalHeight - topGutter - bottomGutter - this.gridLineBleed,
      xOffsetFromLeft: leftGutter + this.gridLineBleed,
      yOffsetFromTop: topGutter,
    };
  }

  private convertDataPointToPixelCoord(dp: ILineChartDataPoint): { x: number; y: number } {
    const xMin = this.extents.xAxisTickValues.min;
    const xMax = this.extents.xAxisTickValues.max;
    const xRange = xMax - xMin;
    const yMin = this.extents.yAxisTickValues.min;
    const yMax = this.extents.yAxisTickValues.max;
    const yRange = yMax - yMin;

    const xPoint =
      xRange === 0
        ? 0
        : ((dp.x - xMin) / xRange) * this.drawingBounds.chartAreaWidth + this.drawingBounds.xOffsetFromLeft;
    const yPoint =
      yRange === 0
        ? 0
        : ((yMax - dp.y) / yRange) * this.drawingBounds.chartAreaHeight + this.drawingBounds.yOffsetFromTop;

    return { x: xPoint, y: yPoint };
  }

  public render(): ReactNode {
    this.calculateExtents();
    this.calculateDrawingBounds();

    const { series, svgClass } = this.props;

    return [
      <svg key={"chart"} ref={this.svgRef} className={combine(style.svg, svgClass)}>
        {this.renderGridLines()}
        {this.renderAxisLabels("x")}
        {this.renderAxisLabels("y")}
        {series.map((s, i) => this.renderSeriesPath(i, s))}
      </svg>,
    ];
  }

  private renderGridLines(): ReactNode {
    const { gridLineClass } = this.props;

    if (!this.drawingBounds?.chartAreaHeight || !this.drawingBounds?.chartAreaWidth) {
      return null;
    }

    const output: ReactNode[] = [];

    this.extents.xAxisTickValues.values.forEach((xValue, idx) => {
      const topCoord = this.convertDataPointToPixelCoord({ x: xValue, y: this.extents.yAxisTickValues.max });
      const bottomCoord = this.convertDataPointToPixelCoord({ x: xValue, y: this.extents.yAxisTickValues.min });

      output.push(
        <line
          key={`x-grid-line-${idx}`}
          className={combine(style.gridLine, gridLineClass)}
          x1={topCoord.x}
          y1={topCoord.y}
          x2={bottomCoord.x}
          y2={bottomCoord.y + this.gridLineBleed}
        />,
      );
    });

    this.extents.yAxisTickValues.values.forEach((yValue, idx) => {
      const leftCoord = this.convertDataPointToPixelCoord({ x: this.extents.xAxisTickValues.min, y: yValue });
      const rightCoord = this.convertDataPointToPixelCoord({ x: this.extents.xAxisTickValues.max, y: yValue });

      output.push(
        <line
          key={`y-grid-line-${idx}`}
          className={combine(style.gridLine, gridLineClass)}
          x1={leftCoord.x - this.gridLineBleed}
          y1={leftCoord.y}
          x2={rightCoord.x}
          y2={rightCoord.y}
        />,
      );
    });

    return output;
  }

  private renderAxisLabels(axis: "x" | "y", renderAsMocks = false): ReactNode {
    const axisProperties = axis === "x" ? this.props.xAxisProperties : this.props.yAxisProperties;
    const axisTickValues = axis === "x" ? this.extents.xAxisTickValues : this.extents.yAxisTickValues;
    const axisMockBounds =
      axis === "x" ? this.drawingBounds?.xAxisLabelMockBounds : this.drawingBounds?.yAxisLabelMockBounds;

    const output: ReactNode[] = [];

    axisTickValues.values.forEach((value, idx) => {
      let x: number;
      let y: number;

      if (renderAsMocks) {
        x = 0;
        y = 0;
      } else {
        const mockBounds = axisMockBounds[idx] || new DOMRect(0, 0, 0, 0);

        if (axis === "x") {
          const dataPosition = this.convertDataPointToPixelCoord({ x: value, y: this.extents.yAxisTickValues.min });

          // the mock text is drawn with its left edge at 0, so the position of the left edge of the rotated
          // box tells us how far past 0 the it spills
          const rotationSpill = mockBounds.left * -1;

          x = dataPosition.x - mockBounds.width + 2 * rotationSpill;
          y = dataPosition.y + mockBounds.height - 2 * rotationSpill + this.gridLineBleed + this.axisLabelMargin;
        } else {
          const dataPosition = this.convertDataPointToPixelCoord({ x: this.extents.xAxisTickValues.min, y: value });
          x = this.drawingBounds.leftGutter - mockBounds.width - this.axisLabelMargin;
          y = dataPosition.y;
        }
      }

      output.push(
        <text
          key={`${axis}-axis-label-${idx}`}
          className={combine(style.axisLabel, axisProperties.axisLabelClass)}
          dominantBaseline={"central"}
          transform={axis === "x" ? `rotate(-45 ${x} ${y})` : ""}
          x={x}
          y={y}
        >
          {axisProperties?.valueRenderer(value) || value}
        </text>,
      );
    });

    return output;
  }

  private renderSeriesPath(idx: number, series: ILineChartSeries): ReactNode {
    if (!this.drawingBounds?.chartAreaHeight || !this.drawingBounds?.chartAreaWidth) {
      return null;
    }

    const strokePoints = series.dataPoints
      .map(this.convertDataPointToPixelCoord)
      .map((p) => `${p.x},${p.y}`)
      .join(" ");

    const strokeElement = <polyline key={`${idx}-stroke`} className={series.strokeClass} points={strokePoints} />;

    if (!series.fillEnabled) {
      return strokeElement;
    } else {
      const yMin = this.extents.yAxisTickValues.min;
      const yMax = this.extents.yAxisTickValues.max;
      const yAnchorPoint = yMin > 0 ? yMin : yMax < 0 ? yMax : 0;
      const fillAnchorPoints = [
        { x: this.extents.maxXValue, y: yAnchorPoint },
        { x: this.extents.minXValue, y: yAnchorPoint },
      ];
      const fillPoints =
        strokePoints +
        " " +
        fillAnchorPoints
          .map(this.convertDataPointToPixelCoord)
          .map((p) => `${p.x},${p.y}`)
          .join(" ");

      const fillElement = <polyline key={`${idx}-fill`} className={series.fillClass} points={fillPoints} />;

      return [strokeElement, fillElement];
    }
  }
}

export { ILineChartDataPoint, ILineChartProps, ILineChartAxisProperties, ILineChartSeries, LineChart };
