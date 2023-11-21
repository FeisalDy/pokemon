'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import useUpdateQueryString from '@/hooks/useUpdateQueryString'

const Search = () => {
  const updateQueryString = useUpdateQueryString()

  const formSchema = z.object({
    search: z.string().toLowerCase()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: ''
    }
  })

  function onSubmit (values: z.infer<typeof formSchema>) {
    const { search } = values
    console.log(search)
    updateQueryString({ name: search }, ['search'])
  }

  return (
    <>
      <div className='flex items-center gap-2'>
        <div className='grow'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='search'
                render={({ field }) => (
                  <FormItem className='relative space-y-0'>
                    <MagnifyingGlassIcon className='absolute left-2 top-2 w-6 h-6 ' />
                    <FormControl>
                      <Input
                        placeholder='Search...'
                        className='pl-10 focus-visible:ring-0'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Search
