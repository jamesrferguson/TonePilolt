function ChordScaleSelector() {
    return (
        <div className="music-selector">
            <div className="circle-container">
                <div className="circle-center-label">Keys</div>
                {/* Cycle of fifths */}
                <div className="circle-key" data-key="C">C</div>
                <div className="circle-key" data-key="G">G</div>
                <div className="circle-key" data-key="D">D</div>
                <div className="circle-key" data-key="A">A</div>
                <div className="circle-key" data-key="E">E</div>
                <div className="circle-key" data-key="B">B</div>
                <div className="circle-key" data-key="F#">F#</div>
                <div className="circle-key" data-key="C#">C#</div>
                <div className="circle-key" data-key="Ab">Ab</div>
                <div className="circle-key" data-key="Eb">Eb</div>
                <div className="circle-key" data-key="Bb">Bb</div>
                <div className="circle-key" data-key="F">F</div>
            </div>
            <div className="grid-container">
                {/* Scale types */}
                <div className="grid-item" data-type="major">Major</div>
                <div className="grid-item" data-type="minor">Minor</div>
                <div className="grid-item" data-type="pentatonic">Pentatonic</div>
                <div className="grid-item" data-type="harmonicMinor">Harmonic Minor</div>
                <div className="grid-item" data-type="melodicMinor">Melodic Minor</div>
                <div className="grid-item" data-type="blues">Blues</div>
            </div>
        </div>
    )
}

export default ChordScaleSelector;