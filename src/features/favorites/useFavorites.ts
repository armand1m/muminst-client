import { useLocalStorage } from 'react-use';
import { Sound } from 'features/api/useMuminstApi';
import { useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<Sound[]>(
    'favorites',
    []
  );

  const safeFavorites = favorites ?? [];

  const add = useCallback(
    (sound: Sound) => {
      const nextState = [...safeFavorites, sound];
      setFavorites(nextState);
    },
    [safeFavorites, setFavorites]
  );

  const remove = useCallback(
    (sound: Sound) => {
      const nextState = safeFavorites.filter(
        (favorite) => favorite.id !== sound.id
      );
      setFavorites(nextState);
    },
    [safeFavorites, setFavorites]
  );

  const has = useCallback(
    (sound: Sound) => {
      return safeFavorites.find(
        (favorite) => favorite.id === sound.id
      );
    },
    [safeFavorites]
  );

  type FavoritesHook = [
    typeof safeFavorites,
    typeof add,
    typeof remove,
    typeof has
  ];

  return [safeFavorites, add, remove, has] as FavoritesHook;
};
