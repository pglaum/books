import { z, } from 'zod'

import { BookVolumeSchema, } from '@/lib/entities/googleBooks'

export const BookListEnum = z.enum([
    'WISHLIST',
    'LIBRARY',
])

export const BookEventTypeEnum = z.enum([
    'BOUGHT',
    'READ',
])

export const BookEventSchema = z.object({
    event: BookEventTypeEnum,
    date: z.string().date().nullish(),
})

export const BookSchema = z.object({
    id: z.string().nullish(),
    user_id: z.string().nullish(),
    google_book_id: z.string(),
    google_book_data: BookVolumeSchema,
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    list: BookListEnum.nullable(),
    is_read: z.boolean().default(false).nullable(),
    events: z.array(BookEventSchema).default([]).nullish(),
})

export type BookList = z.infer<typeof BookListEnum>
export type Book = z.infer<typeof BookSchema>
