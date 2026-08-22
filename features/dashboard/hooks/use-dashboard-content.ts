'use client'

import { dashboardApi } from '../api/dashboard-api'
import type { ContentEntity, ContentMutation } from '../types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  content: () => [...dashboardKeys.all, 'content'] as const
}

export function useDashboardContent(enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.content(),
    queryFn: dashboardApi.content,
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: false
  })
}

export function useSaveContent() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: ContentMutation) =>
      input.id
        ? dashboardApi.update({ ...input, id: input.id })
        : dashboardApi.create(input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: dashboardKeys.content() })
  })
}

export function useDeleteContent() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ entity, id }: { entity: ContentEntity; id: string }) =>
      dashboardApi.remove(entity, id),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: dashboardKeys.content() })
  })
}

export function useUploadMedia() {
  return useMutation({ mutationFn: dashboardApi.upload })
}
