type Timestamps = {
  created: string;
  edited: string;
};

type Url = {
  url: string;
};

type Identifier = {
  id: number;
};

export type TimestampsAndUrl = Timestamps & Url;

export type ApiResponse<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: (T & TimestampsAndUrl)[];
};

export type TimestampsAndIdentifier = Timestamps & Identifier;

export type FormattedApiResponse<T> = {
  results: (T & TimestampsAndIdentifier)[];
  take: number;
  skip: number;
  total: number;
};
