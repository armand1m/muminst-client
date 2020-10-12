import { AsyncState } from 'react-use/lib/useAsync';

interface AsyncResourceProps<T> {
  state: AsyncState<T>;
  fallback: JSX.Element;
  children: (value: T) => JSX.Element;
}

export function AsyncResource<T>({
  state: { loading, error, value },
  fallback,
  children,
}: AsyncResourceProps<T>) {
  if (loading) {
    return fallback;
  }

  if (error) {
    throw error;
  }

  if (value !== undefined) {
    return children(value);
  }

  return null;
}
