"use client"

import { useState } from "react"

import ModeSelector from "@/components/library/ModeSelector";
import LookUp  from "@/components/library/LookUp";
import DetailsSection  from "@/components/library/DetailsSection";
import FretboardSection  from "@/components/library/FretboardSection";


export default function Library() {
    let [chordMode, setChordMode] = useState(false); 

    /TODO delete - for testing only/
    const chords = ["A", "Am", "B", "C", "D", "E", "Em"];

    return (
        <>
            <ModeSelector chordMode={chordMode} setChordMode={setChordMode} />
            <LookUp chords={chords}></LookUp>
            <DetailsSection useChordMode={chordMode}></DetailsSection>
            <FretboardSection></FretboardSection>
        </>
    )
}
