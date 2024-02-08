import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useQuery as useTanstackQuery,
  useMutation as useTanstackMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { QueryOptions } from "./types";

export interface UseQuery<T, E> extends QueryOptions {
  queryKey: QueryKey;
  fetchFn: () => Promise<T>;
  onFetched?: (data: T) => unknown;
  onError?: (error: E) => unknown;
}
/**
 * Use this query to handle non-list data.
 */
export const useQuery = <T = any, E = any>(options: UseQuery<T, E>) => {
  const queryClient = useQueryClient();
  const {
    fetchFn,
    queryKey,
    onFetched,
    autoFetch = false,
    refetchInterval,
    onError,
  } = options;

  const [enabled, setEnabled] = useState(autoFetch);

  const _onError = useCallback(
    async (e: E) => {
      if (onError) return onError(e);
      throw e;
    },
    [onError]
  );

  const queryFn = useCallback(async () => {
    try {
      const response = await fetchFn();
      onFetched && onFetched(response);
      return response;
    } catch (e) {
      _onError(e as E);
    }
  }, [_onError, fetchFn, onFetched]);

  const query = useTanstackQuery<void, E, T, any>({
    queryKey,
    queryFn,
    enabled: !!refetchInterval || enabled,
    refetchInterval,
  });

  const refetch = useCallback(async () => {
    if (!enabled) setEnabled(true);
    return await query.refetch();
  }, [enabled, query]);

  const clear = useCallback(() => {
    if (!autoFetch) setEnabled(false);
    queryClient.removeQueries({ queryKey });
  }, [autoFetch, queryClient, queryKey]);

  const loading = useMemo(
    () => query.isLoading || query.isFetching || query.isRefetching,
    [query.isFetching, query.isLoading, query.isRefetching]
  );

  useEffect(() => {
    setEnabled(autoFetch);
  }, [autoFetch]);

  return {
    ...query,
    refetch,
    clear,
    loading,
  };
};

/**
 * Use this query to handle list data.
 */
export interface UseFetchList<T = any, E = any>
  extends Omit<UseQuery<T, E>, "fetchFn" | "onFetched"> {
  fetchFn: () => Promise<T[]>;
  onFetched?: (data: T[]) => unknown;
  /**
   * This function will used to search data from search keyword.
   * If keyword is empty, it will return all data and ignore this function.
   */
  filterFn?: (data: T, keyword: string) => boolean;
}
export const useFetchList = <T = any, E = unknown>(params: UseFetchList<T>) => {
  const {
    autoFetch = false,
    refetchInterval,
    queryKey,
    fetchFn,
    filterFn,
  } = params;

  const [sortBy, setSortBy] = useState<null | keyof T>(null);
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const _fetchFn = useCallback(async () => {
    return await fetchFn();
  }, [fetchFn, page, perPage]);

  const query = useQuery<T[], E>({
    fetchFn: _fetchFn,
    queryKey,
    autoFetch,
    refetchInterval,
  });

  const data = useMemo(
    () => (query.data ? query.data : []) as T[],
    [query.data]
  );

  const filtered = useMemo(
    () =>
      data.filter((data) => {
        if (search.length <= 0 || !filterFn) return true;
        return filterFn(data, search);
      }),
    [data, filterFn, search]
  );

  return {
    ...query,
    data,
    sortBy,
    setSortBy,
    asc,
    setAsc,
    page,
    setPage,
    perPage,
    setPerPage,
    total,
    setTotal,
    filtered,
    search,
    setSearch,
  };
};

export interface UseMutation<P, R, E, C> {
  autoRefetch?: boolean;
  onSuccess?: (response: R, variables: P, context: C | undefined) => unknown;
  onError?: (response: E, variables: P, context: C | undefined) => unknown;
  corresponseQueryKey?: QueryKey;
  mutationFn: (params: P) => Promise<R>;
}
/**
 * Use this hook to mutate data.
 */
export const useMutation = <P = void, R = any, E = Error, C = any>(
  options: UseMutation<P, R, E, C>
) => {
  const { autoRefetch, onError, onSuccess, corresponseQueryKey, mutationFn } =
    options;

  const client = useQueryClient();

  const _onSuccess = useCallback(
    (data: R, variables: P, context: C | undefined) => {
      onSuccess && onSuccess(data, variables, context);
      autoRefetch &&
        corresponseQueryKey &&
        client.invalidateQueries({ queryKey: corresponseQueryKey });
    },
    [autoRefetch, client, corresponseQueryKey, onSuccess]
  );

  const _onError = useCallback(
    (error: E, variables: P, context: C | undefined) => {
      if (onError) return onError(error, variables, context);
      throw error;
    },
    [onError]
  );

  const mutation = useTanstackMutation<R, E, P, C>({
    onSuccess: _onSuccess,
    onError: _onError,
    mutationFn,
  });

  return mutation;
};
