'use client'

import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import useSWR from 'swr'


import HC_more from 'highcharts/highcharts-more' //module
HC_more(Highcharts) //init module


import HighchartsExporting from 'highcharts/modules/exporting'


if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

let options: Highcharts.Options = {};
const fetcher = (url) => fetch(url).then((res) => res.json());

type Props = {
  sourceId: number
};

export function TimeSeries({ sourceId } : {sourceId : number}) {

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const { data, error, isLoading } = useSWR("/api/getTS?sourceId=" + sourceId, fetcher)

  if (error) return <div>Data loading failed</div>
  if (isLoading) return <div>Loading</div>
  if (isLoading == false && data !== null) {

    const combinedArray: [number, number][] = data[0].obstimes.map((value, index) => [value, data[0].val[index]]);
    const combinedArrayErr: [number, number, number][] = data[0].obstimes.map((value, index) => [value, data[0].val[index] - data[0].valerr[index], data[0].val[index] + data[0].valerr[index]]);

    console.log(combinedArray);

    options = {
      chart: {
        type: 'scatter',
        height: '60%', // Manually setting the chart height
        zooming: {
          type: 'xy'
        },
        animation: false

      },
      xAxis: {
        type: 'linear'
      },

      plotOptions: {
        series: {
          animation: false
        },
        scatter: {
          animation: false
        }
      },
      title: {
        text: data[0].sourceid
      },

      series: [{
        type: 'scatter',
        name: 'Magnitude time series',
        data: combinedArray,
        
        marker: {
          radius: 2
        },
        tooltip: {
          followPointer: false,
          pointFormat: '[{point.x:.4f}, {point.y:.4f}]'
        }
      },
      {
        type: 'errorbar',
        name: 'Error time series',
        data: combinedArrayErr,
        
      },
      ]
    };

    return (
      
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
         // containerProps={{ style: { width: '100%',  height: '100%' } }}
        />
      

    )
  }
}


