function DetailsSection({useChordMode}: {useChordMode: boolean}) {
    console.log(useChordMode);
    if (useChordMode){
        return (
            <div className="chord-diagram">
                {/* Chord Diagram */}
                <h2>C Major Chord Diagram</h2>
                {/* Placeholder for C Major Chord Diagram */}
                <p>Diagram or interactive element for C Major chord goes here.</p>
            </div>
        )
    }
    return (
            (<div className="scale-diagram">
                {/* Scale Diagram  */}
                <h2>C Major Scale Diagram</h2>
                {/* Placeholder for C Major Chord Diagram */}
                <p>Diagram or interactive element for C Major chord goes here.</p>
            </div>)
    )
}

export default DetailsSection;