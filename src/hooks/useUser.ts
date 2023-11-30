import useSWR from 'swr'
import * as UserApi from '@/lib/user'
import { AxiosError } from 'axios'

export function useUser (email: string | null | undefined) {
  const { data, isLoading } = useSWR(email, async () => {
    try {
      return await UserApi.getUser(email)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      } else {
        throw error
      }
    }
  })

  return {
    user: data,
    userLoading: isLoading
  }
}

export function useUsers () {
  const { data, isLoading } = useSWR('getUser', async () => {
    try {
      return await UserApi.getAllUsers()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null
      } else {
        throw error
      }
    }
  })

  return {
    users: data,
    usersLoading: isLoading
  }
}
