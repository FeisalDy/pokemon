'use client'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Search from './Search'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Notification from './notification'

const Navbar = () => {
  const { data: session }: any = useSession()
  return (
    <div className='flex justify-between px-4'>
      <Link href='/'>
        <Image src={'/logo.png'} width={100} height={100} alt='logo' />
      </Link>
      <NavigationMenu className=''>
        <NavigationMenuList className='gap-2'>
          <NavigationMenuItem className='flex'>
            <Search />
          </NavigationMenuItem>

          <NavigationMenuItem className='flex gap-2'>
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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={session.user?.image} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href='/profile'>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <Link href='/lokasi'>
                      <DropdownMenuItem>Find Nearby</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Button
                        onClick={() => {
                          signOut()
                        }}
                        className='w-full'
                      >
                        Logout
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <Notification />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navbar
