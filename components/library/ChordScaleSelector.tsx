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
    const [currentKey, setCurrentKey] = useState("");
    const [currentScaleType, setCurrentScaleType] = useState("");
    const [currentChordType, setCurrentChordType] = useState("");

    const handleKeySelect = useCallback((key: string): void => {
      setCurrentKey(key);
      setCurrentScaleType(currentScale => {
        const newValue = key + " " + currentScale;
        if (chordMode) {
          setActiveChord(newValue);
        } else {
          setActiveScale(newValue);
        }
        return currentScale; 
      });
    }, [chordMode, setActiveChord, setActiveScale]);
    
    const handleChordOrScaleTypeClick = useCallback((type: string): void => {
      const activeValue = currentKey + " " + type;
      if (chordMode) {
        setCurrentChordType(type);
        setActiveChord(activeValue);
      } else {
        setCurrentScaleType(type);
        setActiveScale(activeValue);
      }
    }, [chordMode, currentKey, setActiveChord, setActiveScale]);

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
                  onClick={() => handleChordOrScaleTypeClick(type)}
                  isActive={(chordMode ? currentChordType : currentScaleType) === type}
                />
              ))}
            </div>
        </div>
    );
}

export default ChordScaleSelector;
