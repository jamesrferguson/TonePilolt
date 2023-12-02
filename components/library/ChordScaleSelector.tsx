import { useState, useCallback } from "react";
import { CIRCLE_OF_FIFTHS, SCALE_TYPES, CHORD_TYPES } from "@/components/library/Constants";

type KeyButtonProps = {
  dataKey: string;
  label: string;
  onSelect: (key: string) => void;
  isActive: boolean;
};
  
type ScaleTypeButtonProps = {
  typeName: string;
  onClick: (typeName: string) => void;
  isActive: boolean;
};

function KeyButton({ dataKey, label, onSelect, isActive }: KeyButtonProps) {
  return (
    <div className={`circle-key ${isActive ? 'active' : ''}`} data-key={dataKey} onClick={() => onSelect(dataKey)}>
      {label}
    </div>
  );
}

function ScaleTypeButton({ typeName, onClick, isActive }: ScaleTypeButtonProps) {
  return (
    <div className={`grid-item ${isActive ? 'active' : ''}`} onClick={() => onClick(typeName)}>
      {typeName}
    </div>
  );
}

type ChordScaleSelectorProps = {
  chordMode: boolean;
  setActiveScale: React.Dispatch<React.SetStateAction<string>>;
  setActiveChord: React.Dispatch<React.SetStateAction<string>>;
}

function ChordScaleSelector({chordMode, setActiveChord, setActiveScale}: ChordScaleSelectorProps) {
    const [currentKey, setCurrentKey] = useState("C");
    const [currentScaleType, setCurrentScaleType] = useState("Major");
    const [currentChordType, setCurrentChordType] = useState("Major");

    const updateCurrentScaleOrChord = useCallback(() => {
      const value = currentKey + " " + (chordMode ? currentChordType : currentScaleType);
      if (chordMode) {
        setActiveChord(value);
      } else {
        setActiveScale(value);
      }
    }, [currentKey, currentScaleType, currentChordType, chordMode, setActiveChord, setActiveScale]);
  
    const handleKeySelect = useCallback((key: string) => {
      setCurrentKey(key);
      updateCurrentScaleOrChord();
    }, [updateCurrentScaleOrChord]);
  
    const handleScaleTypeClick = useCallback((type: string) => {
      if (chordMode) {
        setCurrentChordType(type);
      } else {
        setCurrentScaleType(type);
      }
      updateCurrentScaleOrChord();
    }, [chordMode, updateCurrentScaleOrChord]);

    return (
        <div className="music-selector">
            <div className="circle-container">
                <div className="circle-center-label">Keys</div>
                {CIRCLE_OF_FIFTHS.map((key, index) => (
                    <KeyButton
                      key={key}
                      dataKey={key}
                      label={key}
                      onSelect={handleKeySelect}
                      isActive={currentKey === key}
                    />
                ))}
            </div>
            <div className="grid-container">
              {(chordMode ? CHORD_TYPES : SCALE_TYPES).map((type, index) => (
                <ScaleTypeButton
                  key={index}
                  typeName={type}
                  onClick={() => handleScaleTypeClick(type)}
                  isActive={(chordMode ? currentChordType : currentScaleType) === type}
                />
              ))}
            </div>
        </div>
    );
}

export default ChordScaleSelector;
