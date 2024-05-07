import { type BookVolume, BookVolumeSchema, SearchResultSchema, } from "@/lib/entities/googleBooks"

export const searchBooks = async (query: string): Promise<BookVolume[]> => {
    const apiKey = useRuntimeConfig().public.googleApiKey
    const url = new URL('/books/v1/volumes', 'https://www.googleapis.com')
    url.searchParams.append('key', apiKey)
    url.searchParams.append('q', query)
    const response = await fetch(url)
    if (response.ok) {
        const result = SearchResultSchema.parse(await response.json())
        console.log(result)
        return result.items ?? []
    }
    return []
}

export const getGoogleBook = async (bookId: string): Promise<BookVolume | null> => {
    const searchResultsStore = useSearchResultsStore()
    const cachedBook = searchResultsStore.getBook(bookId)
    if (cachedBook) {
        return cachedBook
    }

    const apiKey = useRuntimeConfig().public.googleApiKey
    const url = new URL(`/books/v1/volumes/${bookId}`, 'https://www.googleapis.com')
    url.searchParams.append('key', apiKey)
    const response = await fetch(url)
    if (response.ok) {
        const result = BookVolumeSchema.parse(await response.json())
        searchResultsStore.addBook(bookId, result)
        return result
    }
    return null
}
