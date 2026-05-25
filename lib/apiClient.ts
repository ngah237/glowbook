import { getSession } from 'next-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function getToken() {
  const session = await getSession()
  return session?.accessToken
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = await getToken()
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Une erreur est survenue')
  }
  
  return response.json()
}

export const api = {
  getServices: () => request('/services'),
  getService: (id: string) => request(`/services/${id}`),
  createService: (data: any) => request('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) => request(`/services/${id}`, { method: 'DELETE' }),
  getBookings: (params?: any) => request(`/bookings${params ? `?${new URLSearchParams(params)}` : ''}`),
  createBooking: (data: any) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getDashboardStats: () => request('/stats/dashboard'),
}