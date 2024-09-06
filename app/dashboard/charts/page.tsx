'use client'

import React, { useRef } from 'react';
import { getTS } from '@/app/lib/data';
import { useState, useEffect } from 'react'

import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';


import HC_more from 'highcharts/highcharts-more' //module
HC_more(Highcharts) //init module


import HighchartsExporting from 'highcharts/modules/exporting'
import handler from '@/pages/api/getTS'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

let options: Highcharts.Options = {};

function Datats({ ts }) {
  if (ts != null) {

    console.log(ts);
    
    options = {
      chart: {
        zooming: {
            type: 'xy'
        }
        
      },
      plotOptions: {
        series: {
            // general options for all series
        },
        bubble: {
            minSize: 10,
            maxSize: 10,
            animation : false
          
        }
    },
    title: {
      text: 'test'//ts[0].sourceid
    },
    series: [{
      type: 'scatter',
      data:  [[0],[1],[2],[0],[-1]],
      marker: {
        radius: 10
    },
    tooltip: {
        followPointer: false,
        pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
    }
    },
  ]
  };
    return (
      <div>
        

      </div>

    )
  }
  else{
    return (
      <p>Loading...</p>
    )
  }
}

export default function Page() {


  const [ts, setTS] = useState(null)

  // fetch data
  /** 
  useEffect(() => {
      fetch('/api/getTS')
      .then(res => res.json())
      .then(data => setTS(data))
  }, [])
  */

  useEffect(() => {
    async function fetchPosts() {
      let res = await  fetch('/api/getTS')
      let data = await res.json()
      setTS(data)
    }
    fetchPosts()
  }, [])
  
   

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);


  return (


    <div>

      <Datats ts={ts} />


      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </div>




  );

};
