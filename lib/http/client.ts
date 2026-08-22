import axios, { AxiosError } from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 20_000,
  withCredentials: true,
  headers: { Accept: 'application/json' }
})

type ErrorPayload = { error?: string; message?: string }

export function getApiError(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ErrorPayload | undefined
    return payload?.error || payload?.message || error.message || fallback
  }
  return error instanceof Error ? error.message : fallback
}
