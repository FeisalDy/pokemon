'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type QueryParams = Record<string, string | undefined>

function createQueryString (
  params: Record<string, string | undefined>,
  currentSearchParams?: URLSearchParams
): string {
  const newSearchParams = new URLSearchParams(
    currentSearchParams?.toString() ?? ''
  )

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      newSearchParams.delete(key)
    } else {
      newSearchParams.set(key, String(value))
    }
  }

  return newSearchParams.toString()
}

function useUpdateQueryString (): (
  params: QueryParams,
  deleteKeys?: string[]
) => void {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFn = useCallback(
    (params: QueryParams, deleteKeys: string[] = []) => {
      // Convert existing search params to an object
      const currentParams: QueryParams = {}
      for (const [key, value] of searchParams.entries()) {
        currentParams[key] = value
      }

      // Merge with new params
      const updatedParams = { ...currentParams, ...params }

      // Delete specified keys
      deleteKeys.forEach(key => {
        delete updatedParams[key]
      })

      const updatedQueryString = createQueryString(updatedParams)

      router.push(`${pathname}?${updatedQueryString}`)
    },
    [searchParams]
  )

  return updateFn
}

export default useUpdateQueryString
