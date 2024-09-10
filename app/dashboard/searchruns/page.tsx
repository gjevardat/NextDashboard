'use client'

import React from 'react';
import AutoCompleteRuns from '@/app/components/AutoCompleteRuns';
import { useState } from 'react'
import { SourceResultId } from '@/app/components/SourceResultIdList';
import { TimeSeries } from '@/app/components/TimeSeriesChart';
import Operators from '@/app/components/Operators'
interface run {
    runid: number,
    runname: string

}

interface source {
    sourceid: number,
}

export default function Page() {


    const [selectedRun, setSelectedRun] = useState<run>();
    const [selectedSource, setSelectedSource] = useState<number>();

    return (



        
        <div className="flex flex-col min-h-screen p-4">


            {/* Top Component */}
            <div >
                <AutoCompleteRuns onRunSelect={setSelectedRun} />
            </div>

            {/* Bottom Layout */}
            <div className="flex flex-1">
                {/* Left Section */}
                <div className="w-1/4  p-4">
                    <div>
                        {selectedRun && <SourceResultId onSourceSelect={setSelectedSource} run={selectedRun} />}
                    </div>
                    <div>
                        {selectedRun && <Operators/>}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex-1 p-4 flex-grow" >
                    {selectedSource && Number(selectedSource) != 0 && <TimeSeries sourceId={Number(selectedSource)} />}
                </div>
            </div>
            {selectedSource && <p> sourceId={selectedSource}</p>}
        </div>
    )
}









