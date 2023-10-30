type ModeSelectorProps = {
    chordMode: boolean;
    setChordMode: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
function ModeSelector({ chordMode, setChordMode }: ModeSelectorProps) {
    return (
        <div className="toggle-buttons">
            <button id="scaleModeBtn" onClick={() => setChordMode(false)} className={!chordMode ? "active" : ""}>
                Scale Mode
            </button>
            <button id="chordModeBtn" onClick={() => setChordMode(true)} className={chordMode ? "active" : ""}>
                Chord Mode
            </button>
        </div>
    );
}

export default ModeSelector;