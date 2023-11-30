import { AxiosUser } from '@/lib/axios'
import { User } from '@/models/User'

export async function getUser (email: string | null | undefined) {
  const res = await AxiosUser.get<User>(`/save/${email}`)
  return res.data
}

export async function getAllUsers () {
  const res = await AxiosUser.get<User[]>(`/getUser`)
  return res.data
}
