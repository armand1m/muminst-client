import { useState } from 'react';
import { useSearchParam } from 'react-use';
import { Sound } from 'features/api/useMuminstApi';

export const useSearch = () => {
  const initialState = useSearchParam('search') ?? '';
  const [search, setSearchState] = useState<string>(initialState);

  const setSearch = (value: string) => {
    setSearchState(value);
    window.history.replaceState(
      null,
      'Muminst Search',
      `?search=${value}`
    );
  };

  const matchSearch = (sound: Sound) => {
    return sound.name.toLowerCase().includes(search.toLowerCase());
  };

  return {
    search,
    setSearch,
    matchSearch,
  };
};
