type Timestamps = {
  created: string;
  edited: string;
};

type Url = {
  url: string;
};

type TimestampsAndUrl = Timestamps & Url;

export type ApiResponse<T> = {
  count: number;
  next?: string;
  previous?: string;
  results: (T & TimestampsAndUrl)[];
};
