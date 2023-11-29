import { useState } from "react";

const CIRCLE_OF_FIFTHS = ["C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "Eb", "Bb", "F"];
const SCALE_TYPES = ["Major", "Minor", "Pentatonic", "Harmonic Minor", "Melodic Minor", "Blues"];

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

function ChordScaleSelector() {
    const [currentKey, setCurrentKey] = useState("C");
    const [currentScaleType, setCurrentScaleType] = useState("Major");

    const handleKeySelect  = (key: string): void => {
        setCurrentKey(key);
    };

    const handleScaleTypeClick = (type: string): void => {
        setCurrentScaleType(type);
    };

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
                {SCALE_TYPES.map((type, index) => (
                    <ScaleTypeButton
                        key={index}
                        typeName={type}
                        onClick={handleScaleTypeClick}
                        isActive={currentScaleType === type}
                    />
                ))}
            </div>
        </div>
    );
}

export default ChordScaleSelector;
