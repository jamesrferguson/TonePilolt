type KeySelectorProps = {
    keyName: string;
    isActive: boolean;
    setCurrentKey: React.Dispatch<React.SetStateAction<string>>;
};

export default function KeySelector({keyName, isActive, setCurrentKey}: KeySelectorProps) {



    return (
        <div className={isActive ? "circle-key active" : "circle-key"}>{keyName}</div>
    );
}