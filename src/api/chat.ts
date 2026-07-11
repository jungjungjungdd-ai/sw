import apiClient from './client'
import type { ChatTurnRequest, ChatTurnResponse } from '../types/chat'

export const sendChatTurn = (body: ChatTurnRequest) =>
  apiClient
    .post<ChatTurnResponse>('/api/chat/turn', body)
    .then((res) => res.data)
