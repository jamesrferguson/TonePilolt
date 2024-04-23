import { type } from 'os';
import {useState, useEffect, useRef, ChangeEvent} from 'react';


type LookUpProps = {
  chords: string[];
  scales: string[];
  chordMode: boolean;
  activeScale: string;
  setActiveScale: React.Dispatch<React.SetStateAction<string>>;
  activeChord: string;
  setActiveChord: React.Dispatch<React.SetStateAction<string>>;
}

function LookUp ({chords, scales, chordMode, activeChord, setActiveChord, activeScale, setActiveScale}: LookUpProps) {
  let [currentInputText, setInputText] = useState("");

  const [query, setQuery] = useState<string>(chordMode ? activeChord : activeScale);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lookUpList, setLookupList] = useState<string[]>(chords);
  const [userInput, setUserInput] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setInputText(e.target.value);
    setUserInput(true);
  };

  useEffect(() => {
    if (query && userInput) {
      const filtered = lookUpList.filter(el => el.toLowerCase().startsWith(query.toLowerCase()));
      setSuggestions(filtered);
    }  else {
      setSuggestions([]);
    }
  }, [query, userInput]);

  useEffect(() => {
    setQuery(chordMode ? activeChord : activeScale);
  }, [activeScale, activeChord, chordMode]);

  useEffect(() => {
    if (chordMode) {
      setLookupList(chords);
    } else {
      setLookupList(scales);
    }
  }, [chordMode]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setUserInput(false);
  };

  useEffect(() => {
    // Add event listener to document
    document.addEventListener('mousedown', handleDocumentClick);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const handleDocumentClick = (event: MouseEvent) => {
    if (
      inputRef.current && !inputRef.current.contains(event.target as Node) &&
      suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
    }
  };
  
  const onSearchBtnClick = () => {
    if (chordMode) {
      setActiveChord(query);
    } else {
      setActiveScale(query);
    }
  };

  return (
      <div className="search-section">
        <input ref={inputRef} type="text" id="searchInput" onChange={handleInputChange} placeholder="Search for a chord..." value={query} />
        <div ref={suggestionsRef} className="suggestions">
        {suggestions.map((suggestion, index) => (
          <div key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </div>
        ))}
      </div>
        <button id="searchBtn" onClick={onSearchBtnClick}>Search</button>
      </div>
  )
}

export default LookUp;