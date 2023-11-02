import {useState, useEffect, useRef, ChangeEvent} from 'react';


interface LookUpProps {
  chords: string[];
}

function LookUp ({chords}: LookUpProps) {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (query) {
      const filtered = chords.filter(chord => chord.toLowerCase().startsWith(query.toLowerCase()));
      setSuggestions(filtered);
    }  else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
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
        <button id="searchBtn">Search</button>
      </div>
  )
}

export default LookUp;