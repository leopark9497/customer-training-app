import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { GradientTealBlue } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';




// accessors
const getActivity = (d: ActivityDuration) => d.activity;
const getActivityFrequency = (d: ActivityDuration) => Number(d.duration);
const verticalMargin = 120;


export type ActivityDuration = { activity: string, duration: number }

export type BarsProps = {
  data: Array<ActivityDuration>
  width: number;
  height: number;
  events?: boolean;
};

export default function Chart({ data, width, height, events = false }: BarsProps) {
  const xMax = width;
  const yMax = height - verticalMargin;

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getActivity),
        padding: 0.4,
      }),
    [xMax, data],
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getActivityFrequency))],
      }),
    [yMax, data],
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <GradientTealBlue id="teal" />
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const activity = getActivity(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getActivityFrequency(d)) ?? 0);
          const barX = xScale(activity);
          const barY = yMax - barHeight;
          return (
            <Bar
              key={`bar-${activity}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(23, 63, 217, .6)"
              onClick={() => {
                if (events) alert(`clicked: ${JSON.stringify(Object.values(d))}`);
              }}
            />
          );
        })}
      </Group>
      <AxisBottom
        top={yMax + verticalMargin/2}
        scale={xScale}
        stroke={'rgba(23, 63, 217, .8)'}
        tickStroke={'rgba(23, 63, 217, .8)'}
        hideAxisLine
        tickLabelProps={() => ({
          fill: 'rgba(23, 323, 217, .6)',
          fontSize: 16,
          textAnchor: 'middle',
        })}
      />
      <AxisLeft 
        top={verticalMargin/2}
        left={30}
        scale={yScale}
        stroke={'rgba(23, 63, 217, .8)'}
        hideTicks
        hideAxisLine
        tickLabelProps={() => ({
          fill: 'rgba(23, 63, 217, .6)',
          fontSize: 16,
          textAnchor: 'start',
        })}
      />
    </svg>
  );
}