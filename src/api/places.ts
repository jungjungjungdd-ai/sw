import apiClient from './client'
import type {
  Place,
  PlaceListQuery,
  PlaceScoreRequest,
  PlaceScoreResult,
  PlaceBatchScoreRequest,
  PlaceBatchScoreResult,
} from '../types/place'

export const getPlaces = (query: PlaceListQuery = {}) =>
  apiClient
    .get<Place[]>('/api/places', { params: query })
    .then((res) => res.data)

export const getPlace = (placeId: string) =>
  apiClient.get<Place>(`/api/places/${placeId}`).then((res) => res.data)

export const scorePlace = (placeId: string, body: PlaceScoreRequest) =>
  apiClient
    .post<PlaceScoreResult>(`/api/places/${placeId}/score`, body)
    .then((res) => res.data)

export const scorePlacesBatch = (body: PlaceBatchScoreRequest) =>
  apiClient
    .post<PlaceBatchScoreResult>('/api/places/batch/scores', body)
    .then((res) => res.data)
