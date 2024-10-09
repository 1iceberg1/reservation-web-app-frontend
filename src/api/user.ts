import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';
import { toQueryString } from 'src/utils/to-query-string';

// ----------------------------------------------------------------------

export function useGetUsers(query: any = null) {
  const queryParams = query ? `?${toQueryString(query).toString()}` : null;
  const URL = queryParams ? `${endpoints.user}${queryParams}` : endpoints.user;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      users: data?.rows || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.count,
    }),
    [data?.rows, data?.count, error, isLoading, isValidating]
  );

  // Manually trigger re-fetching the data
  const fetchManually = async () => {
    await mutate(URL); // This forces a re-fetch
  };

  return { ...memoizedValue, fetchManually };
}

// ----------------------------------------------------------------------

export function useGetUser(id: string) {
  const URL = id ? `${endpoints.user}/${id}` : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      user: data,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
