'use client'


import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel  } from '@mui/x-data-grid';
import React, { useRef } from 'react';
import { getTS } from '@/app/lib/data';
import { useState, useEffect } from 'react'

import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import useSWR from 'swr'

import Listbox from "react-widgets/Listbox";

import HC_more from 'highcharts/highcharts-more' //module
HC_more(Highcharts) //init module


import HighchartsExporting from 'highcharts/modules/exporting'
import handler from '@/pages/api/getTS'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
}

let options: Highcharts.Options = {};


interface run {
    runid: number,
    runname: string
    
}

interface source {
    sourceid: number,
}



const columns: GridColDef[] = [
    { field: 'sourceid', headerName: 'Source id', width: 200 }
];



const fetcher = (url) => fetch(url).then((res) => res.json());



function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
export function LoadTs( { sourceId }) {
    console.log(sourceId)
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const { data, error, isLoading } = useSWR("/api/getTS?sourceId="+sourceId, fetcher)
  
    if (error) return <div>Data loading failed</div>
    if (isLoading) return <div>Loading</div>
    if( data !== undefined && data!== null && data != null){
    
    console.log(data[0])
    const combinedArray: [number, number][] = data[0].obstimes.map((value, index) => [value, data[0].val[index]]);
    const combinedArrayErr: [number, number, number][] = data[0].obstimes.map((value, index) => [value, data[0].val[index] - data[0].valerr[index], data[0].val[index] + data[0].valerr[index]]);
    
    console.log(combinedArray);
    
    options = {
      xAxis: {
        type: 'linear'
      },
      chart: {
        zooming: {
          type: 'xy'
        },
        animation: false
        
      },
      plotOptions: {
        series: {
          // general options for all series
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
        data: combinedArray,//.map(tuple => ({ x: tuple[0], y: tuple[1] })) ,
        pointInterval: 0.01,
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
  
  return <div>
      <p>{sourceId}</p>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        />
    </div>
      }
  }
export default function Asynchronous() {

  const { data, error, isLoading } = useSWR("/api/getRunInfo?offset=0&size=1000", fetcher)

  let runnames : string[] ;
  if(data!= null){
       runnames = data.map((elem,index)=>elem.runname)
  }
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState();
  const [options, setOptions] = React.useState<readonly string[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(0.01); // For demo purposes.

      if (active) {
        setOptions([...runnames]);
        
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <div className="w-full flex-none md:w-96">

    
    <Autocomplete
    value={value}
    onChange={(event: any, newValue: string | null) => {
        if (newValue !== null) {
            const match = newValue.match(/_(\d+)$/); // Match number after the last underscore
            if (match !== null) {
              setValue(match[1]); // Set the extracted number
            } else {
              setValue(""); // Set empty if no match is found
            }
          } else {
            setValue(""); // Set empty if newValue is null
          }
        }}
    
      sx={{ width: 1000 }}
      
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search run..."
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
    <p>{value}</p>
    

    
        
        {value && <SourceResultId runid={value} />}
    </div>
  );
}


 function SourceResultId({runid} : run){
    
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
      });

      const [rowSelectionModel, setRowSelectionModel] =      React.useState<GridRowSelectionModel>([]);
  
    
      console.log("runid is:"+runid)
      const { data, error, isLoading } = useSWR("/api/getSourceResultId?runid="+runid+"&offset="+ (paginationModel.page*25) +"&size="+paginationModel.pageSize
      , fetcher)
      
      if (data != null) {
          
     
        const elementsWithId: source[] = data.map((element: source, index: number) => ({
            ...element,
            id: element.sourceid 
        }));

        return (
            
            <div>

            <DataGrid
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                rows={elementsWithId}
                columns={columns}
                rowCount={200}
            	loading={isLoading}
                pageSizeOptions={[10]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
            />
            <p> selected sourceid : {rowSelectionModel}</p>
            {rowSelectionModel && <LoadTs sourceId={86105504493056}/>}
            </div>
        );
    }
}


