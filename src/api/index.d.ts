type ApiRequest<Params = undefined> = Params extends undefined
  ? { config?: import('axios').AxiosRequestConfig }
  : { config?: import('axios').AxiosRequestConfig } & Params;

interface IdParam {
  id: number;
}

interface ApiQuery<Func = unknown> {
  config?: import('axios').AxiosRequestConfig;
  options?: Omit<
    import('@tanstack/react-query').UseQueryOptions<
      Awaited<ReturnType<Func>>,
      any,
      Awaited<ReturnType<Func>>,
      any
    >,
    'queryFn' | 'queryKey'
  >;
}

interface ApiMutation<Params = void, Func = unknown> {
  config?: import('axios').AxiosRequestConfig;
  options?: import('@tanstack/react-query').UseMutationOptions<
    Awaited<ReturnType<Func>>,
    any,
    Params,
    any
  >;
}
