import { type BookVolume, SearchResultSchema, } from "@/lib/entities/googleBooks"

export const searchBooks = async (query: string): Promise<BookVolume[]> => {
    const apiKey = useRuntimeConfig().public.googleApiKey
    const url = new URL('/books/v1/volumes', 'https://www.googleapis.com')
    url.searchParams.append('key', apiKey)
    url.searchParams.append('q', query)
    const response = await fetch(url)
    if (response.ok) {
        const result = SearchResultSchema.parse(await response.json())
        console.log(result)
        return result.items
    }
    return []
}
