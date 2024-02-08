/**
 * Common query options for useQuery hooks.
 */
export interface QueryOptions {
  autoFetch?: boolean;
  /**
   * Interval in ms
   */
  refetchInterval?: number;
}
