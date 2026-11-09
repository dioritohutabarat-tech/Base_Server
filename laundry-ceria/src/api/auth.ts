import { request } from './client'
import type { Staf } from '../types'

export interface LoginResponse {
  token: string
  staf: Staf
}

export const login = (username: string, password: string) =>
  request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const getMe = () => request<Staf>('/auth/me')