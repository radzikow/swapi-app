type Timestamps = {
  created: string;
  edited: string;
};

type Url = {
  url: string;
};

type Id = {
  id: number;
};

export type TimestampsAndUrl = Timestamps & Url;

export type ApiResponse<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: (T & TimestampsAndUrl)[];
};

export type TimestampsAndId = Timestamps & Id;

export type FormattedApiResponse<T> = {
  results: (T & TimestampsAndId)[];
  take: number;
  skip: number;
  total: number;
};
