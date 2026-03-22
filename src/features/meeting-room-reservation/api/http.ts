import Axios from 'axios';

const axios = Axios.create();

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, options?: { status?: number; data?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.data = options?.data;
  }
}

function normalizeHttpError(error: unknown, fallbackMessage: string) {
  if (!Axios.isAxiosError(error)) {
    return new ApiError(fallbackMessage);
  }

  const responseData = error.response?.data as { message?: string } | undefined;
  return new ApiError(responseData?.message ?? fallbackMessage, {
    status: error.response?.status,
    data: error.response?.data,
  });
}

export const http = {
  get<Response = unknown>(url: string) {
    return axios
      .get<Response>(url)
      .then(res => res.data)
      .catch(error => {
        throw normalizeHttpError(error, '요청에 실패했습니다.');
      });
  },
  post<Request = unknown, Response = unknown>(url: string, data?: Request) {
    return axios
      .post<Response>(url, { data })
      .then(res => res.data)
      .catch(error => {
        throw normalizeHttpError(error, '요청에 실패했습니다.');
      });
  },
  delete<Response = unknown>(url: string) {
    return axios
      .delete<Response>(url)
      .then(res => res.data)
      .catch(error => {
        throw normalizeHttpError(error, '요청에 실패했습니다.');
      });
  },
};
