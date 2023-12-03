"use client"

import { useState } from "react"

import ModeSelector from "@/components/library/ModeSelector";
import LookUp  from "@/components/library/LookUp";
import DetailsSection  from "@/components/library/DetailsSection";
import FretboardSection  from "@/components/library/FretboardSection";
import ChordScaleSelector from "@/components/library/ChordScaleSelector";
import { ALL_NOTES, CHORD_TYPES, SCALE_TYPES } from "@/components/library/Constants";


export default function Library() {
    let [chordMode, setChordMode] = useState(false);
    let [activeScale, setActiveScale] = useState("");
    let [activeChord, setActiveChord] = useState("");

    const scales = ALL_NOTES.flatMap(key => 
      SCALE_TYPES.map(scaleType => `${key} ${scaleType}`)
    );

    const chords = ALL_NOTES.flatMap(key => 
      CHORD_TYPES.map(chordType => `${key} ${chordType}`)
    );

    return (
        <>
            <ModeSelector chordMode={chordMode} setChordMode={setChordMode} />
            <LookUp chords={chords} scales={scales} chordMode={chordMode} setActiveScale={setActiveScale} setActiveChord={setActiveChord} />
            <ChordScaleSelector chordMode={chordMode} setActiveScale={setActiveScale} setActiveChord={setActiveChord} />
            <DetailsSection useChordMode={chordMode}></DetailsSection>
            <FretboardSection chordMode={chordMode} activeScale={activeScale} activeChord={activeChord}/>
        </>
    )
};