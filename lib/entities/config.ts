import { z, } from 'zod'

export const ConfigKeyEnum = z.enum([
    'WISHLIST_ORDER',
])

export const ConfigSchema = z.object({
    id: z.number().nullish(),
    key: ConfigKeyEnum,
    user_id: z.string().nullish(),
    data: z.any(),
})

export type Config = z.infer<typeof ConfigSchema>
