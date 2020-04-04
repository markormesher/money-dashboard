import * as React from "react";
import { PureComponent, ReactNode, RefObject, CSSProperties } from "react";
import { combine } from "../../../helpers/style-helpers";
import * as style from "./LineChart.scss";

// TODO: tidy up these interfaces
// TODO: implement 2-pass rendering

interface ILineChartDataPoint {
  readonly x: number;
  readonly y: number;
}

interface IAxisTickValues {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly values: number[];
}

interface IAxisProperties {
  readonly valueRenderer?: (value: number) => string;
  readonly forcedValues?: number[];
  readonly axisLabelClass?: string;
}

interface ILineChartSeries {
  readonly label: string;
  readonly strokeClass?: string;
  readonly fillClass?: string;
  readonly fillEnabled?: boolean;
  readonly dataPoints: ILineChartDataPoint[];
}

interface ILineChartProps {
  readonly series: ILineChartSeries[];
  readonly xAxisProperties?: IAxisProperties;
  readonly yAxisProperties?: IAxisProperties;
  readonly svgClass?: string;
  readonly gridLineClass?: string;
}

interface ILineChartState {
  readonly triggerRender: number;
}

interface ILineChartExtents {
  readonly minXValue: number;
  readonly maxXValue: number;
  readonly minYValue: number;
  readonly maxYValue: number;
  readonly xAxisTickValues: IAxisTickValues;
  readonly yAxisTickValues: IAxisTickValues;
}

interface ILineChartDrawingBounds {
  readonly totalWidth: number;
  readonly totalHeight: number;
  readonly chartAreaWidth: number;
  readonly chartAreaHeight: number;
  readonly xAxisLabelMockBounds: DOMRect[];
  readonly yAxisLabelMockBounds: DOMRect[];
  readonly maxXAxisLabelWidth: number;
  readonly maxXAxisLabelHeight: number;
  readonly maxYAxisLabelWidth: number;
  readonly maxYAxisLabelHeight: number;
  readonly xOffsetFromLeft: number;
  readonly yOffsetFromTop: number;
}

class LineChart extends PureComponent<ILineChartProps, ILineChartState> {
  private svgRef: RefObject<SVGSVGElement>;
  private xAxisLabelSizingRef: RefObject<SVGSVGElement>;
  private yAxisLabelSizingRef: RefObject<SVGSVGElement>;
  private windowResizeDebounceTimeout: NodeJS.Timer = undefined;

  private CHART_AREA_MARGIN = 10;

  private svgMockStyle: CSSProperties = {
    position: "fixed",
    top: -1000,
  };

  constructor(props: ILineChartProps) {
    super(props);
    this.state = {
      triggerRender: 0,
    };

    this.svgRef = React.createRef();
    this.xAxisLabelSizingRef = React.createRef();
    this.yAxisLabelSizingRef = React.createRef();

    this.handleResize = this.handleResize.bind(this);
    this.triggerRerender = this.triggerRerender.bind(this);

    this.calculateExtents = this.calculateExtents.bind(this);
    this.calculateDrawingBounds = this.calculateDrawingBounds.bind(this);

    this.renderGridLines = this.renderGridLines.bind(this);
    this.renderXAxisLabels = this.renderXAxisLabels.bind(this);
    this.renderYAxisLabels = this.renderYAxisLabels.bind(this);
    this.renderSeriesPath = this.renderSeriesPath.bind(this);
  }

  public componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
    global.setTimeout(() => {
      console.log("---- TIMED RE-RENDER ----");
      this.triggerRerender();
    }, 100);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  private handleResize(): void {
    global.clearTimeout(this.windowResizeDebounceTimeout);
    this.windowResizeDebounceTimeout = global.setTimeout(this.triggerRerender, 100);
  }

  private triggerRerender(): void {
    this.setState({ triggerRender: new Date().getTime() });
  }

  private static calculateAxisTickValues(
    min: number,
    max: number,
    targetStepCount = 10,
    simple = false,
  ): IAxisTickValues {
    if (max < min) {
      throw new Error(`Invalid axis range: min = ${min}; max = ${max}`);
    }

    if (max === min) {
      // create an artificial range if there's no actual range
      max += 1;
      min -= 1;
    }

    const range = max - min;
    const roughStep = range / (targetStepCount - 1);

    if (simple) {
      const values: number[] = [];
      for (let i = min; i <= max; i += roughStep) {
        values.push(i);
      }

      return {
        min,
        max,
        step: roughStep,
        values,
      };
    } else {
      const goodNormalisedSteps = [1, 1.5, 2, 2.5, 5, 7.5, 10];

      const stepMagnitude = Math.pow(10, -Math.floor(Math.log10(Math.abs(roughStep))));
      const normalisedStep = roughStep * stepMagnitude;
      const goodNormalisedStep = goodNormalisedSteps.filter((s) => s >= normalisedStep)[0];
      const step = goodNormalisedStep / stepMagnitude;

      const axisMax = Math.ceil(max / step) * step;
      const axisMin = Math.floor(min / step) * step;

      const values: number[] = [];
      for (let i = axisMin; i <= axisMax; i += step) {
        values.push(i);
      }

      return {
        max: axisMax,
        min: axisMin,
        step,
        values,
      };
    }
  }

  private calculateExtents(): ILineChartExtents {
    const { series, xAxisProperties, yAxisProperties } = this.props;
    // compute the min/max x/y points across all series
    const allDataPoints: ILineChartDataPoint[] = [];
    series.map((s) => s.dataPoints).forEach((dps) => allDataPoints.push(...dps));

    let minXValue = allDataPoints.length ? Math.min(...allDataPoints.map((d) => d.x)) : 0;
    let maxXValue = allDataPoints.length ? Math.max(...allDataPoints.map((d) => d.x)) : 1;
    let minYValue = allDataPoints.length ? Math.min(...allDataPoints.map((d) => d.y)) : 0;
    let maxYValue = allDataPoints.length ? Math.max(...allDataPoints.map((d) => d.y)) : 1;

    // adjust min/max values to include any forced values
    if (xAxisProperties?.forcedValues?.length) {
      maxXValue = Math.max(maxXValue, ...xAxisProperties.forcedValues);
      minXValue = Math.min(minXValue, ...xAxisProperties.forcedValues);
    }

    if (yAxisProperties?.forcedValues?.length) {
      maxYValue = Math.max(maxYValue, ...yAxisProperties.forcedValues);
      minYValue = Math.min(minYValue, ...yAxisProperties.forcedValues);
    }

    const xAxisTickValues = LineChart.calculateAxisTickValues(minXValue, maxXValue, 10, true);
    const yAxisTickValues = LineChart.calculateAxisTickValues(minYValue, maxYValue);

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
    const svgWidth = this.svgRef.current?.width.baseVal.value || 0;
    const svgHeight = this.svgRef.current?.height.baseVal.value || 0;

    const xAxisLabelMocks = this.xAxisLabelSizingRef.current?.children;
    const xAxisLabelMockBounds: DOMRect[] = [];
    if (xAxisLabelMocks) {
      for (let i = 0; i < xAxisLabelMocks.length; ++i) {
        xAxisLabelMockBounds.push((xAxisLabelMocks.item(i) as SVGTextElement).getBBox());
      }
    }

    const yAxisLabelMocks = this.yAxisLabelSizingRef.current?.children;
    const yAxisLabelMockBounds: DOMRect[] = [];
    if (yAxisLabelMocks) {
      for (let i = 0; i < yAxisLabelMocks.length; ++i) {
        yAxisLabelMockBounds.push((yAxisLabelMocks.item(i) as SVGTextElement).getBBox());
      }
    }

    const maxXAxisLabelWidth = Math.max(0, ...xAxisLabelMockBounds.map((b) => b.width));
    const maxXAxisLabelHeight = Math.max(0, ...xAxisLabelMockBounds.map((b) => b.height));
    const maxYAxisLabelWidth = Math.max(0, ...yAxisLabelMockBounds.map((b) => b.width));
    const maxYAxisLabelHeight = Math.max(0, ...yAxisLabelMockBounds.map((b) => b.height));

    const topGutter = maxYAxisLabelHeight ? maxYAxisLabelHeight / 2 : 0;
    const bottomGutter = maxXAxisLabelHeight * 1.5;
    const leftGutter = maxYAxisLabelWidth;
    const rightGutter = 0;

    return {
      totalWidth: svgWidth,
      totalHeight: svgHeight,
      xAxisLabelMockBounds,
      yAxisLabelMockBounds,
      maxXAxisLabelWidth,
      maxXAxisLabelHeight,
      maxYAxisLabelWidth,
      maxYAxisLabelHeight,
      chartAreaWidth: svgWidth - leftGutter - rightGutter - this.CHART_AREA_MARGIN,
      chartAreaHeight: svgHeight - topGutter - bottomGutter - this.CHART_AREA_MARGIN,
      xOffsetFromLeft: leftGutter + this.CHART_AREA_MARGIN,
      yOffsetFromTop: topGutter,
    };
  }

  private static convertDataPointToPixelCoordinate(
    dp: ILineChartDataPoint,
    extents: ILineChartExtents,
    drawingBounds: ILineChartDrawingBounds,
  ): { x: number; y: number } {
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
    console.log("---- RENDER ----");
    console.log(this.calculateDrawingBounds());

    const { series, svgClass } = this.props;

    return [
      <svg key={"x-axis-sizing-mock"} ref={this.xAxisLabelSizingRef} style={this.svgMockStyle}>
        {this.renderXAxisLabels(true)}
      </svg>,
      <svg key={"y-axis-sizing-mock"} ref={this.yAxisLabelSizingRef} style={this.svgMockStyle}>
        {this.renderYAxisLabels(true)}
      </svg>,
      <svg
        key={"chart"}
        ref={this.svgRef}
        onClick={this.triggerRerender}
        width={"100%"}
        height={"100%"}
        className={svgClass}
      >
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
      const topCoord = LineChart.convertDataPointToPixelCoordinate(
        { x: xValue, y: extents.yAxisTickValues.max },
        extents,
        drawingBounds,
      );
      const bottomCoord = LineChart.convertDataPointToPixelCoordinate(
        { x: xValue, y: extents.yAxisTickValues.min },
        extents,
        drawingBounds,
      );

      output.push(
        <line
          key={`x-grid-line-${idx}`}
          className={combine(style.gridLine, gridLineClass)}
          x1={topCoord.x}
          y1={topCoord.y}
          x2={bottomCoord.x}
          y2={bottomCoord.y + this.CHART_AREA_MARGIN}
        />,
      );
    });

    extents.yAxisTickValues.values.forEach((yValue, idx) => {
      const leftCoord = LineChart.convertDataPointToPixelCoordinate(
        { x: extents.xAxisTickValues.min, y: yValue },
        extents,
        drawingBounds,
      );
      const rightCoord = LineChart.convertDataPointToPixelCoordinate(
        { x: extents.xAxisTickValues.max, y: yValue },
        extents,
        drawingBounds,
      );

      output.push(
        <line
          key={`y-grid-line-${idx}`}
          className={combine(style.gridLine, gridLineClass)}
          x1={leftCoord.x - this.CHART_AREA_MARGIN}
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
      const position = renderForSizing
        ? { x: 0, y: 0 }
        : LineChart.convertDataPointToPixelCoordinate({ x: xValue, y: 0 }, extents, drawingBounds);

      const mockBounds = drawingBounds.xAxisLabelMockBounds[idx] || { width: 0, height: 0 };
      const x = renderForSizing ? 0 : position.x - mockBounds.width / 2;
      const y = renderForSizing
        ? 0
        : drawingBounds.chartAreaHeight + drawingBounds.yOffsetFromTop + this.CHART_AREA_MARGIN + mockBounds.height;

      output.push(
        <text
          key={`x-axis-label-${idx}`}
          className={combine(style.axisLabel, xAxisProperties.axisLabelClass)}
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
      const position = renderForSizing
        ? { x: 0, y: 0 }
        : LineChart.convertDataPointToPixelCoordinate({ x: 0, y: yValue }, extents, drawingBounds);

      const mockBounds = drawingBounds.yAxisLabelMockBounds[idx] || { width: 0, height: 0 };
      const x = renderForSizing ? 0 : drawingBounds.maxYAxisLabelWidth - mockBounds.width;
      const y = renderForSizing ? 0 : position.y + mockBounds.height / 4;

      output.push(
        <text
          key={`y-axis-label-${idx}`}
          className={combine(style.axisLabel, yAxisProperties.axisLabelClass)}
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
    // TODO: make fill optional
    const drawingBounds = this.calculateDrawingBounds();
    const extents = this.calculateExtents();

    if (!drawingBounds?.chartAreaHeight || !drawingBounds?.chartAreaWidth) {
      return null;
    }

    const strokePoints = series.dataPoints
      .map((dp) => LineChart.convertDataPointToPixelCoordinate(dp, extents, drawingBounds))
      .map((p) => `${p.x},${p.y}`)
      .join(" ");

    const strokeElement = <polyline key={`${idx}-stroke`} className={series.strokeClass} points={strokePoints} />;

    if (!series.fillEnabled) {
      return strokeElement;
    } else {
      const yAnchorPoint = extents.minYValue > 0 ? extents.minYValue : extents.maxYValue < 0 ? extents.maxYValue : 0;
      const fillAnchorPoints = [
        { x: extents.maxXValue, y: yAnchorPoint },
        { x: extents.minXValue, y: yAnchorPoint },
      ];
      const fillPoints =
        strokePoints +
        " " +
        fillAnchorPoints
          .map((dp) => LineChart.convertDataPointToPixelCoordinate(dp, extents, drawingBounds))
          .map((p) => `${p.x},${p.y}`)
          .join(" ");

      const fillElement = <polyline key={`${idx}-fill`} className={series.fillClass} points={fillPoints} />;

      return [strokeElement, fillElement];
    }
  }
}

export { ILineChartDataPoint, ILineChartProps, IAxisProperties, ILineChartSeries, LineChart };
