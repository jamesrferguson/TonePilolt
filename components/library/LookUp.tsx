import {useState, useEffect, ChangeEvent} from 'react';


interface LookUpProps {
  chords: string[];
}

function LookUp ({chords}: LookUpProps) {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  return (
      <div className="search-section">
        <input type="text" id="searchInput" onChange={handleInputChange} placeholder="Search for a chord..." value={query} />
        <div className="suggestions">
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