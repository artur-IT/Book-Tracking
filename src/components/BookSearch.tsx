import type { CSSProperties } from 'react';
import { useRef } from 'react';

const style: {
  container: CSSProperties;
  input: CSSProperties;
  button: CSSProperties;
} = {
  container: {
    margin: '0 auto',
    width: '400px',
  },

  input: {
    width: '250px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #666',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #666',
  },
};

export default function BookSearch({ setSearchingWord }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (word: string) => {
    return setSearchingWord(word);
  };
  const clearSearch = () => {
    inputRef.current.value = '';
    inputRef.current.focus();
    setSearchingWord('');
  };

  return (
    <section style={style.container}>
      <input
        ref={inputRef}
        type='text'
        name='search'
        placeholder='Search by title or author'
        style={style.input}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <button style={style.button} onClick={clearSearch}>
        Clear
      </button>
    </section>
  );
}
