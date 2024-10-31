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
        <div className="library">
            <h1>Chord and Scale Library</h1>
            <ModeSelector chordMode={chordMode} setChordMode={setChordMode} />
            <LookUp chords={chords} scales={scales} chordMode={chordMode} activeScale={activeScale} setActiveScale={setActiveScale} activeChord={activeChord} setActiveChord={setActiveChord} />
            <ChordScaleSelector chordMode={chordMode} activeScale={activeScale} setActiveScale={setActiveScale} activeChord={activeChord} setActiveChord={setActiveChord} />
            <DetailsSection chordMode={chordMode} activeChord={activeChord} activeScale={activeScale}></DetailsSection>
            <FretboardSection chordMode={chordMode} activeScale={activeScale} activeChord={activeChord}/>
        </div>
        </>
    )
};