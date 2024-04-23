import { useState, useCallback, useEffect } from "react";
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
  activeScale: string;
  activeChord: string;
  setActiveScale: React.Dispatch<React.SetStateAction<string>>;
  setActiveChord: React.Dispatch<React.SetStateAction<string>>;
}

function ChordScaleSelector({chordMode, activeScale, activeChord, setActiveChord, setActiveScale}: ChordScaleSelectorProps) {
    const [currentKey, setCurrentKey] = useState(chordMode ? activeChord.split(' ')[0] : activeScale.split(' ')[0]);
    const [currentScaleType, setCurrentScaleType] = useState(chordMode ? '' : activeScale.split(' ')[1]);
    const [currentChordType, setCurrentChordType] = useState(chordMode ? activeChord.split(' ')[1] : '');

    useEffect(() => {
        if (chordMode) {
            const [key, type] = activeChord.split(' ');
            setCurrentKey(key);
            setCurrentChordType(type);
        } else {
            const [key, type] = activeScale.split(' ');
            setCurrentKey(key);
            setCurrentScaleType(type);
        }
    }, [activeScale, activeChord, chordMode]);

    const handleKeySelect = useCallback((key: string): void => {
      setCurrentKey(key);
      const newValue = key + " " + currentScaleType;
      if (chordMode) {
        setActiveChord(newValue);
      } else {
        setActiveScale(newValue);
      }
    }, [chordMode, setActiveChord, setActiveScale, currentScaleType]);
    
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
