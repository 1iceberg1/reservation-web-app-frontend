import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';
import { toQueryString } from 'src/utils/to-query-string';

// ----------------------------------------------------------------------

export function useGetConsumptions(query: any = null) {
  const queryParams = query ? `?${toQueryString(query).toString()}` : null;
  const URL =
    queryParams ?
      `${endpoints.consumption}${queryParams}`
    : endpoints.consumption;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      consumptions: data?.rows || [],
      consumptionsLoading: isLoading,
      consumptionsError: error,
      consumptionsValidating: isValidating,
      consumptionsEmpty: !isLoading && !data?.count,
    }),
    [data?.rows, data?.count, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConsumption(id: string) {
  const URL = id ? `${endpoints.consumption}/${id}` : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      consumption: data,
      consumptionLoading: isLoading,
      consumptionError: error,
      consumptionValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
