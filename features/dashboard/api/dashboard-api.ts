import type { DashboardData, ContentEntity, ContentMutation } from '../types'
import { apiClient } from '@/lib/http/client'

export const dashboardApi = {
  async login(credentials: { email: string; password: string }) {
    const { data } = await apiClient.post<{ ok: true }>(
      '/admin/login',
      credentials
    )
    return data
  },
  async logout() {
    const { data } = await apiClient.post<{ ok: true }>('/admin/logout')
    return data
  },
  async content() {
    const { data } = await apiClient.get<DashboardData>('/admin/content')
    return data
  },
  async create(input: ContentMutation) {
    const { data } = await apiClient.post('/admin/content', input)
    return data
  },
  async update(input: ContentMutation & { id: string }) {
    const { data } = await apiClient.patch('/admin/content', input)
    return data
  },
  async remove(entity: ContentEntity, id: string) {
    const { data } = await apiClient.delete('/admin/content', {
      data: { entity, id }
    })
    return data
  },
  async upload(file: File) {
    const body = new FormData()
    body.append('file', file)
    const { data } = await apiClient.post<{ url: string }>(
      '/admin/upload',
      body
    )
    return data
  }
}
