import { 
  createApi, 
  fetchBaseQuery, 
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from './features/auth/authSlice';
import type { RootState } from './store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://ethare-ai-task.vercel.app/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token || localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshToken = (api.getState() as RootState).auth.refreshToken || localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      const refreshResult: any = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const user = (api.getState() as RootState).auth.user || JSON.parse(localStorage.getItem('user') || 'null');
        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data.data.tokens;
        
        // Store the new token
        api.dispatch(setCredentials({ user, token: accessToken, refreshToken: newRefreshToken }));
        
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Project', 'Task', 'User', 'Dashboard'],
  endpoints: () => ({}),
});
