import type { BookVolume, } from "~/lib/entities/googleBooks"

export const useSearchResultsStore = defineStore('search-results', {
    state () {
        return {
            results: [],
            books: {},
        }
    },
    actions: {
        getBook (bookId: string) {
            if (this.books[bookId]) {
                return this.books[bookId]
            }

            return null
        },
        addBook (bookId: string, book: BookVolume) {
            this.books[bookId] = book
        },
    },
})

