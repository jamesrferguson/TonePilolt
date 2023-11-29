"use client"

import { useState } from "react"

import ModeSelector from "@/components/library/ModeSelector";
import LookUp  from "@/components/library/LookUp";
import DetailsSection  from "@/components/library/DetailsSection";
import FretboardSection  from "@/components/library/FretboardSection";
import ChordScaleSelector from "@/components/library/ChordScaleSelector";


export default function Library() {
    let [chordMode, setChordMode] = useState(false);
    let [activeScale, setActiveScale] = useState("");
    let [activeChord, setActiveChord] = useState("");

    /TODO delete - for testing only/
    //const chords = ["A", "Am", "B", "C", "D", "E", "Em"];

    // TODO remove duplication in here and in FretboardSection
    const FLAT_SYMBOL = String.fromCharCode(9837);
    const keys = [ 'A', 'B' + FLAT_SYMBOL, 'B', 'C', 'C#', 'D', 'E' + FLAT_SYMBOL, 'E', 'F', 'F#', 'G', 'G#' ];

    const scaleTypes = ['major', 'minor', 'pentatonic', 'harmonic minor'];
    const chordTypes = ['major', 'minor'];

    const scales = keys.flatMap(key => 
        scaleTypes.map(scaleType => `${key} ${scaleType}`)
      );

    const chords = keys.flatMap(key => 
        chordTypes.map(chordType => `${key} ${chordType}`)
      );

    return (
        <>
            <ModeSelector chordMode={chordMode} setChordMode={setChordMode} />
            <LookUp chords={chords} scales={scales} chordMode={chordMode} setActiveScale={setActiveScale} setActiveChord={setActiveChord} />
            <ChordScaleSelector />
            <DetailsSection useChordMode={chordMode}></DetailsSection>
            <FretboardSection chordMode={chordMode} activeScale={activeScale} activeChord={activeChord}/>
        </>
    )
};