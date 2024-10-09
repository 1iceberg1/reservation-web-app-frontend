import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';
import { toQueryString } from 'src/utils/to-query-string';

// ----------------------------------------------------------------------

export function useGetReservations(query: any = null) {
  const queryParams = query ? `?${toQueryString(query).toString()}` : null;
  const URL =
    queryParams ?
      `${endpoints.reservation}${queryParams}`
    : endpoints.reservation;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      reservations: data?.rows || [],
      reservationsLoading: isLoading,
      reservationsError: error,
      reservationsValidating: isValidating,
      reservationsEmpty: !isLoading && !data?.count,
    }),
    [data?.rows, data?.count, error, isLoading, isValidating]
  );

  // Manually trigger re-fetching the data
  const fetchReservationsManually = async () => {
    await mutate(URL); // This forces a re-fetch
  };

  return { ...memoizedValue, fetchReservationsManually };
}

// ----------------------------------------------------------------------

export function useGetReservation(id: string) {
  const URL = id ? `${endpoints.reservation}/${id}` : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      reservation: data,
      reservationLoading: isLoading,
      reservationError: error,
      reservationValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  // Manually trigger re-fetching the data
  const fetchReservationManually = async () => {
    await mutate(URL); // This forces a re-fetch
  };

  return { ...memoizedValue, fetchReservationManually };
}
