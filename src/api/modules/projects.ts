import { apiClient } from '@/api/client';
import type { PaginationParams, PaginationResponse } from '@/types/api/common';
import type { components } from '@/types/api/generated';

export type Project = components['schemas']['Project'];
export type ProjectInput = components['schemas']['ProjectInput'];
export type ProjectUpdateInput = components['schemas']['ProjectUpdateInput'];
export type DeleteResult = components['schemas']['DeleteResult'];

export function getProjects(
  params: PaginationParams = {},
  signal?: AbortSignal,
): Promise<PaginationResponse<Project>> {
  return apiClient.get<PaginationResponse<Project>>('/projects', {
    params,
    signal,
  });
}

export function getProject(id: number, signal?: AbortSignal): Promise<Project> {
  return apiClient.get<Project>(`/projects/${id}`, { signal });
}

export function createProject(input: ProjectInput): Promise<Project> {
  return apiClient.post<Project, ProjectInput>('/projects', input);
}

export function updateProject(
  id: number,
  input: ProjectUpdateInput,
): Promise<Project> {
  return apiClient.patch<Project, ProjectUpdateInput>(`/projects/${id}`, input);
}

export function deleteProject(id: number): Promise<DeleteResult> {
  return apiClient.delete<DeleteResult>(`/projects/${id}`);
}
