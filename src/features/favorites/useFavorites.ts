import { useLocalStorage } from 'react-use';
import { Sound } from 'features/api/useMuminstApi';

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<Sound[]>(
    'favorites',
    []
  );

  const safeFavorites = favorites ? favorites : [];

  const add = (sound: Sound) => {
    const nextState = [...safeFavorites, sound];
    setFavorites(nextState);
  };

  const remove = (sound: Sound) => {
    const nextState = safeFavorites.filter(
      (favorite) => favorite.id !== sound.id
    );
    setFavorites(nextState);
  };

  const has = (sound: Sound) => {
    return safeFavorites.find((favorite) => favorite.id === sound.id);
  };

  type FavoritesHook = [
    typeof safeFavorites,
    typeof add,
    typeof remove,
    typeof has
  ];

  return [safeFavorites, add, remove, has] as FavoritesHook;
};
