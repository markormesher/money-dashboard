import * as React from "react";
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
  private xAxisLabelSizingRef: RefObject<SVGSVGElement>;
  private yAxisLabelSizingRef: RefObject<SVGSVGElement>;

  private windowResizeDebounceTimeout: NodeJS.Timer;

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
    this.xAxisLabelSizingRef = React.createRef();
    this.yAxisLabelSizingRef = React.createRef();

    this.handleResize = this.handleResize.bind(this);

    this.calculateExtents = this.calculateExtents.bind(this);
    this.calculateDrawingBounds = this.calculateDrawingBounds.bind(this);
    this.convertDataPointToPixelCoord = this.convertDataPointToPixelCoord.bind(this);

    this.triggerRerender = this.triggerRerender.bind(this);
    this.renderGridLines = this.renderGridLines.bind(this);
    this.renderXAxisLabels = this.renderXAxisLabels.bind(this);
    this.renderYAxisLabels = this.renderYAxisLabels.bind(this);
    this.renderSeriesPath = this.renderSeriesPath.bind(this);
  }

  public componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
    global.setTimeout(this.triggerRerender, 100);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  public componentDidUpdate(prevProps: ILineChartProps): void {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // trigger a second-pass re-render
      this.triggerRerender();
    }
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
      for (let i = min; i <= max; i += step) {
        output.push(i);
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

  private calculateExtents(): ILineChartExtents {
    const { series, xAxisProperties, yAxisProperties } = this.props;
    const drawingBounds = this.calculateDrawingBounds();

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

    const xAxisTickValues = LineChart.calculateAxisTickValues(
      minXValue,
      maxXValue,
      xAxisProperties.approxTickCount ||
        Math.max(2, Math.floor(drawingBounds.chartAreaWidth / this.approxPxPerXAxisTick)),
      xAxisProperties.forceAxisRangeToBeExact,
    );
    const yAxisTickValues = LineChart.calculateAxisTickValues(
      minYValue,
      maxYValue,
      yAxisProperties.approxTickCount ||
        Math.max(2, Math.floor(drawingBounds.chartAreaHeight / this.approxPxPerYAxisTick)),
      yAxisProperties.forceAxisRangeToBeExact,
    );

    return {
      minXValue,
      maxXValue,
      minYValue,
      maxYValue,
      xAxisTickValues,
      yAxisTickValues,
    };
  }

  private calculateDrawingBounds(): ILineChartDrawingBounds {
    const totalWidth = this.svgRef.current?.width.baseVal.value || 0;
    const totalHeight = this.svgRef.current?.height.baseVal.value || 0;

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

    const xAxisLabelMocks = this.xAxisLabelSizingRef.current?.children;
    const xAxisLabelMockBounds: DOMRect[] = [];
    if (xAxisLabelMocks) {
      for (let i = 0; i < xAxisLabelMocks.length; ++i) {
        xAxisLabelMockBounds.push(getTransformedBBox(xAxisLabelMocks.item(i) as SVGTextElement));
      }
    }

    const yAxisLabelMocks = this.yAxisLabelSizingRef.current?.children;
    const yAxisLabelMockBounds: DOMRect[] = [];
    if (yAxisLabelMocks) {
      for (let i = 0; i < yAxisLabelMocks.length; ++i) {
        yAxisLabelMockBounds.push(getTransformedBBox(yAxisLabelMocks.item(i) as SVGTextElement));
      }
    }

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

    return {
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
    const extents = this.calculateExtents();
    const drawingBounds = this.calculateDrawingBounds();

    const xMin = extents.xAxisTickValues.min;
    const xMax = extents.xAxisTickValues.max;
    const xRange = xMax - xMin;
    const yMin = extents.yAxisTickValues.min;
    const yMax = extents.yAxisTickValues.max;
    const yRange = yMax - yMin;

    const xPoint =
      xRange === 0 ? 0 : ((dp.x - xMin) / xRange) * drawingBounds.chartAreaWidth + drawingBounds.xOffsetFromLeft;
    const yPoint =
      yRange === 0 ? 0 : ((yMax - dp.y) / yRange) * drawingBounds.chartAreaHeight + drawingBounds.yOffsetFromTop;

    return { x: xPoint, y: yPoint };
  }

  public render(): ReactNode {
    const { series, svgClass } = this.props;

    return [
      <svg key={"x-axis-sizing-mock"} ref={this.xAxisLabelSizingRef} className={style.svgMock}>
        {this.renderXAxisLabels(true)}
      </svg>,
      <svg key={"y-axis-sizing-mock"} ref={this.yAxisLabelSizingRef} className={style.svgMock}>
        {this.renderYAxisLabels(true)}
      </svg>,
      <svg key={"chart"} ref={this.svgRef} className={combine(style.svg, svgClass)}>
        {this.renderGridLines()}
        {this.renderYAxisLabels()}
        {this.renderXAxisLabels()}
        {series.map((s, i) => this.renderSeriesPath(i, s))}
      </svg>,
    ];
  }

  private renderGridLines(): ReactNode {
    const { gridLineClass } = this.props;
    const drawingBounds = this.calculateDrawingBounds();
    const extents = this.calculateExtents();

    if (!drawingBounds?.chartAreaHeight || !drawingBounds?.chartAreaWidth) {
      return null;
    }

    const output: ReactNode[] = [];

    extents.xAxisTickValues.values.forEach((xValue, idx) => {
      const topCoord = this.convertDataPointToPixelCoord({ x: xValue, y: extents.yAxisTickValues.max });
      const bottomCoord = this.convertDataPointToPixelCoord({ x: xValue, y: extents.yAxisTickValues.min });

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

    extents.yAxisTickValues.values.forEach((yValue, idx) => {
      const leftCoord = this.convertDataPointToPixelCoord({ x: extents.xAxisTickValues.min, y: yValue });
      const rightCoord = this.convertDataPointToPixelCoord({ x: extents.xAxisTickValues.max, y: yValue });

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

  private renderXAxisLabels(renderForSizing = false): ReactNode {
    const { xAxisProperties } = this.props;
    const drawingBounds = this.calculateDrawingBounds();
    const extents = this.calculateExtents();

    if (!renderForSizing && (!drawingBounds?.chartAreaHeight || !drawingBounds?.chartAreaWidth)) {
      return null;
    }

    const output: ReactNode[] = [];

    extents.xAxisTickValues.values.forEach((xValue, idx) => {
      let x: number;
      let y: number;

      if (renderForSizing) {
        x = 0;
        y = 0;
      } else {
        const dataPosition = this.convertDataPointToPixelCoord({ x: xValue, y: extents.yAxisTickValues.min });
        const mockBounds = drawingBounds.xAxisLabelMockBounds[idx] || new DOMRect(0, 0, 0, 0);

        // the mock text is drawn with its left edge at 0, so the position of the left edge of the rotated
        // box tells us how far past 0 the it spills
        const rotationSpill = mockBounds.left * -1;

        x = dataPosition.x - mockBounds.width + 2 * rotationSpill;
        y = dataPosition.y + mockBounds.height - 2 * rotationSpill + this.gridLineBleed + this.axisLabelMargin;
      }

      output.push(
        <text
          key={`x-axis-label-${idx}`}
          className={combine(style.axisLabel, xAxisProperties.axisLabelClass)}
          dominantBaseline={"central"}
          transform={`rotate(-45 ${x} ${y})`}
          x={x}
          y={y}
        >
          {xAxisProperties?.valueRenderer(xValue) || xValue}
        </text>,
      );
    });

    return output;
  }

  private renderYAxisLabels(renderForSizing = false): ReactNode {
    const { yAxisProperties } = this.props;
    const drawingBounds = this.calculateDrawingBounds();
    const extents = this.calculateExtents();

    if (!renderForSizing && (!drawingBounds?.chartAreaHeight || !drawingBounds?.chartAreaWidth)) {
      return null;
    }

    const output: ReactNode[] = [];

    extents.yAxisTickValues.values.forEach((yValue, idx) => {
      let x: number;
      let y: number;

      if (renderForSizing) {
        x = 0;
        y = 0;
      } else {
        const dataPosition = this.convertDataPointToPixelCoord({ x: extents.xAxisTickValues.min, y: yValue });
        const mockBounds = drawingBounds.yAxisLabelMockBounds[idx] || new DOMRect(0, 0, 0, 0);

        x = drawingBounds.leftGutter - mockBounds.width - this.axisLabelMargin;
        y = dataPosition.y;
      }

      output.push(
        <text
          key={`y-axis-label-${idx}`}
          className={combine(style.axisLabel, yAxisProperties.axisLabelClass)}
          dominantBaseline={"central"}
          x={x}
          y={y}
        >
          {yAxisProperties?.valueRenderer(yValue) || yValue}
        </text>,
      );
    });

    return output;
  }

  private renderSeriesPath(idx: number, series: ILineChartSeries): ReactNode {
    const drawingBounds = this.calculateDrawingBounds();
    const extents = this.calculateExtents();

    if (!drawingBounds?.chartAreaHeight || !drawingBounds?.chartAreaWidth) {
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
      const yMin = extents.yAxisTickValues.min;
      const yMax = extents.yAxisTickValues.max;
      const yAnchorPoint = yMin > 0 ? yMin : yMax < 0 ? yMax : 0;
      const fillAnchorPoints = [
        { x: extents.maxXValue, y: yAnchorPoint },
        { x: extents.minXValue, y: yAnchorPoint },
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
