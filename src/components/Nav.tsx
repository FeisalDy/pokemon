'use client'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Search from './Search'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const Navbar = () => {
  const { data: session }: any = useSession()
  return (
    <div>
      <ul className='flex justify-between p-4 items-center'>
        <div>
          <Link href='/'>
            <li>Home</li>
          </Link>
        </div>
        <div className='flex gap-2'>
          <Search />
          {!session ? (
            <>
              <Link href='/login'>
                <Button>Login</Button>
              </Link>
              <Link href='/register'>
                <Button variant='outline'>Register</Button>
              </Link>
            </>
          ) : (
            <>
              <Badge>
                <Link href='/profile'>{session.user?.email} </Link>
              </Badge>
              <li>
                <Button
                  onClick={() => {
                    signOut()
                  }}
                >
                  Logout
                </Button>
              </li>
            </>
          )}
        </div>
      </ul>
    </div>
  )
}

export default Navbar
