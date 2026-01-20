export type MitmLogEntry = {
  time?: string;
  client_ip?: string | null;
  method?: string;
  url?: string;
  status?: number;
  req_headers?: Record<string, unknown>;
  req_body?: unknown;
  res_body?: unknown;
  [key: string]: unknown;
};

export type CacheEntry = {
  timestamp: number;
  data: { userId: string; user: Record<string, unknown> } | null;
};
