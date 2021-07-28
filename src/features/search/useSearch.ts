import { useState, useCallback } from 'react';
import { useSearchParam } from 'react-use';

export const useSearch = () => {
  const initialState = useSearchParam('search') ?? '';
  const [search, setSearchState] = useState<string>(initialState);

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value);
      window.history.replaceState(
        null,
        'Muminst Search',
        `?search=${value}`
      );
    },
    [setSearchState]
  );

  return {
    search,
    setSearch,
  };
};
