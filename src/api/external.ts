import apiClient from './client'
import type {
  ExternalStatus,
  TourNearbyQuery,
  TourSearchQuery,
  RouteEstimateRequest,
  RouteEstimateResult,
} from '../types/external'

export const getTourStatus = () =>
  apiClient
    .get<ExternalStatus>('/api/external/tour/status')
    .then((res) => res.data)

export const refreshTour = () =>
  apiClient.post('/api/external/tour/refresh').then((res) => res.data)

export const getTourNearby = (query: TourNearbyQuery) =>
  apiClient
    .get('/api/external/tour/nearby', { params: query })
    .then((res) => res.data)

export const searchTour = (query: TourSearchQuery) =>
  apiClient
    .get('/api/external/tour/search', { params: query })
    .then((res) => res.data)

export const getRoutesStatus = () =>
  apiClient
    .get<ExternalStatus>('/api/external/routes/status')
    .then((res) => res.data)

export const estimateRoute = (body: RouteEstimateRequest) =>
  apiClient
    .post<RouteEstimateResult>('/api/external/routes/estimate', body)
    .then((res) => res.data)
