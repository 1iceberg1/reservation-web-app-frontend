import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';
import { toQueryString } from 'src/utils/to-query-string';

// ----------------------------------------------------------------------

export function useGetPayments(query: any = null) {
  const queryParams = query ? `?${toQueryString(query).toString()}` : null;
  const URL =
    queryParams ? `${endpoints.payment}${queryParams}` : endpoints.payment;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      payments: data?.rows || [],
      paymentsLoading: isLoading,
      paymentsError: error,
      paymentsValidating: isValidating,
      paymentsEmpty: !isLoading && !data?.count,
    }),
    [data?.rows, data?.count, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPayment(id: string) {
  const URL = id ? `${endpoints.payment}/${id}` : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      payment: data,
      paymentLoading: isLoading,
      paymentError: error,
      paymentValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
