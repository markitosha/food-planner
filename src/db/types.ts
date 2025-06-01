export type DbReturn<T> = {
  data: T;
  status: 'success' | 'error';
  error?: string;
};
