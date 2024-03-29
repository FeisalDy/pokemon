'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserT } from '@/models/UserT'

export type Payment = {
  id: string
  email: string
  image: string
  status: string
  distance: string
}

export const columns: ColumnDef<UserT>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image: string = row.getValue('image')

      return (
        <div className=''>
          <Avatar>
            <AvatarImage src={image} alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    accessorKey: 'distance',
    header: ({ column }) => {
      return (
        <div className='text-right'>
          <Button
            variant='ghost'
            className='px-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Distance
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const distance = parseFloat(row.getValue('distance'))
      const formattedDistance = (distance * 1).toFixed(2)

      return (
        <div className='text-right font-medium'>{formattedDistance} Km</div>
      )
    }
  },
  {
    accessorKey: 'status',
    header: () => <div className='text-right'>Status</div>,
    cell: ({ row }) => {
      const status: string = row.getValue('status')

      return <div className='text-right font-medium'>{status}</div>
    }
  },
  {
    accessorKey: 'userEmail'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const updatePet = async () => {
        try {
          const email = row.getValue('userEmail')
          const res = await fetch(`/api/friends/add`, {
            method: 'PATCH',
            body: JSON.stringify({
              email: email,
              friendEmail: row.getValue('email')
            })
          })

          if (res.ok) {
            console.log('success')
            window.location.reload()
          } else {
            console.error('Failed to add friend:', res.status)
          }
        } catch (error) {
          console.error('Error adding friend:', error)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => updatePet()}>
              Add friend
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
