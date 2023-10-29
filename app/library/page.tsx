
function ModeSelector() {
    return (
        <div className="toggle-buttons">
            <button id="scaleModeBtn">Scale Mode</button>
            <button id="chordModeBtn" className="active">Chord Mode</button>
        </div>
    )
}

function LookUp() {
    return (
        <div className="search-section">
          <input type="text" id="searchInput" placeholder="Search for a chord..." />
          <button id="searchBtn">Search</button>
        </div>
    )
}

function DetailsSection() {
    return (
        <div className="details-section">
          <div className="scale-diagram" style={{display: 'none'}}>
              {/* Scale Diagram  */}
              <h2>C Major Scale Diagram</h2>
              {/* Placeholder for C Major Chord Diagram */}
              <p>Diagram or interactive element for C Major chord goes here.</p>
          </div>
          
          <div className="chord-diagram">
              {/* Chord Diagram */}
              <h2>C Major Chord Diagram</h2>
              {/* Placeholder for C Major Chord Diagram */}
              <p>Diagram or interactive element for C Major chord goes here.</p>
          </div>
        </div>
    )
}

function FretboardSection() {
    return (
        <div className="fretboard-section">
            {/* Full Fretboard Diagram */}
            <svg id="full-fretboard" viewBox="0 0 1100 150" xmlns="http://www.w3.org/2000/svg">
            {/* Strings */}
            <line x1="50" y1="20" x2="1050" y2="20" style={{ stroke: 'black', strokeWidth: 2 }} />
            <line x1="50" y1="40" x2="1050" y2="40" style={{ stroke: 'black', strokeWidth: 2 }} />
            <line x1="50" y1="60" x2="1050" y2="60" style={{ stroke: 'black', strokeWidth: 2 }} />
            <line x1="50" y1="80" x2="1050" y2="80" style={{ stroke: 'black', strokeWidth: 2 }} />
            <line x1="50" y1="100" x2="1050" y2="100" style={{ stroke: 'black', strokeWidth: 2 }} />
            <line x1="50" y1="120" x2="1050" y2="120" style={{ stroke: 'black', strokeWidth: 2 }} />

            {/* Frets and nut */}
            <line x1="50" y1="5" x2="50" y2="135" style={{ stroke: 'black', strokeWidth: 6 }} /> {/* Nut */}
            <line x1="150" y1="5" x2="150" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="250" y1="5" x2="250" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="350" y1="5" x2="350" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="450" y1="5" x2="450" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="550" y1="5" x2="550" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="650" y1="5" x2="650" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="750" y1="5" x2="750" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="850" y1="5" x2="850" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="950" y1="5" x2="950" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />
            <line x1="1050" y1="5" x2="1050" y2="135" style={{ stroke: 'black', strokeWidth: 4 }} />

          
            {/* Fret Markers */}
            <circle cx="200" cy="70" r="5" fill="green"/> 
            <circle cx="400" cy="70" r="5" fill="green"/> 
            <circle cx="600" cy="70" r="5" fill="green"/> 
            <circle cx="900" cy="70" r="5" fill="green"/> 
            {/* C Major Scale Notes (Circles) */}
            <circle cx="825" cy="120" r="5" fill="red"/>
            <circle cx="275" cy="100" r="5" fill="red"/> 
            <circle cx="475" cy="100" r="5" fill="red"/> 
            <circle cx="225" cy="80" r="5" fill="red"/> 
            <circle cx="425" cy="80" r="5" fill="red"/> 
            <circle cx="75" cy="60" r="5" fill="red"/> 
            <circle cx="225" cy="60" r="5" fill="red"/> 
            <circle cx="425" cy="60" r="5" fill="red"/> 
            <circle cx="125" cy="40" r="5" fill="red"/> 
            <circle cx="325" cy="40" r="5" fill="red"/> 
            <circle cx="525" cy="40" r="5" fill="red"/> 
            <circle cx="325" cy="20" r="5" fill="red"/>
            <circle cx="525" cy="20" r="5" fill="red"/> 
            </svg>
        </div>
    )
}

export default function() {
    return (
        <>
            <ModeSelector></ModeSelector>
            <LookUp></LookUp>
            <DetailsSection></DetailsSection>
            <FretboardSection></FretboardSection>
        </>
    )
}