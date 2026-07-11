import apiClient from './client'
import type { Trip, TripPlanRequest, TripReplanRequest } from '../types/trip'

export const planTrip = (body: TripPlanRequest) =>
  apiClient.post<Trip>('/api/trips/plan', body).then((res) => res.data)

export const getTrip = (tripId: string) =>
  apiClient.get<Trip>(`/api/trips/${tripId}`).then((res) => res.data)

export const replanTrip = (tripId: string, body: TripReplanRequest) =>
  apiClient
    .post<Trip>(`/api/trips/${tripId}/replan`, body)
    .then((res) => res.data)
