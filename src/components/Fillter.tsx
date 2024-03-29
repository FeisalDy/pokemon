'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import useUpdateQueryString from '@/hooks/useUpdateQueryString'
import { useTypeList } from '@/hooks/usePokemon'
import { useState, useEffect } from 'react'

type FillterProps = {
  fillter: string
}

export function Fillter ({ fillter }: FillterProps) {
  const { typeList, typeListLoading } = useTypeList()

  const typeNames = typeList?.results?.map(type => type.name)
  typeNames?.unshift('Choose')
  const updateQueryString = useUpdateQueryString()

  const [position, setPosition] = useState(fillter)

  useEffect(() => {
    const selectedValue = position === 'Choose' ? '' : position
    updateQueryString({ fillter: selectedValue?.toString() })
  }, [position, updateQueryString])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>Kategori</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Pilih Kategori</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {typeNames?.map((typeName, index) => (
            <DropdownMenuRadioItem key={index} value={typeName}>
              {typeName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
