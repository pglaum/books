<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        <H1>Inventory mode</H1>

        <div
            v-if="!hideHint"
            @click="hideHint = true"
        >
            <Blockquote>
                <P>
                    Inventory mode is for quickly scanning & adding books to your library or your wishlist.<br>
                    When you click on a book, it will immediately be added to the library (or wishlist).
                    Then the page will reset itself, so you can quickly add the next one.
                </P>
            </Blockquote>
        </div>

        <div class="flex gap-4">
            <CheckInput
                v-model="toLibrary"
                label="Save to library"
            />
            <CheckInput
                v-if="toLibrary"
                v-model="setCurrentDate"
                label="Set current date"
            />
        </div>

        <Tabs
            default-value="scanner"
            class="w-full"
        >
            <TabsList class="w-full">
                <TabsTrigger
                    value="scanner"
                    class="flex w-full gap-2"
                >
                    <Barcode class="size-4" />
                    Scanner
                </TabsTrigger>
                <TabsTrigger
                    value="search"
                    class="flex w-full gap-2"
                >
                    <Search class="size-4" />
                    Search
                </TabsTrigger>
            </TabsList>
            <TabsContent value="scanner">
                <Scanner
                    v-if="!isbn && !query"
                    @scanned="searchIsbn"
                />
                <div
                    v-else
                    class="flex flex-col gap-4"
                >
                    <div
                        v-if="isbn"
                        class="flex gap-2"
                    >
                        ISBN:
                        <Code>{{ isbn }}</Code>
                    </div>
                    <div
                        v-else
                        class="flex gap-2"
                    >
                        Query:
                        <Code>{{ query }}</Code>
                    </div>
                    <div>
                        <Button
                            variant="primary-outline"
                            size="sm"
                            @click="resetPage()"
                        >
                            <RotateCcw class="size-4" />
                            Reset
                        </Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="search">
                <div class="flex flex-col gap-2">
                    <form
                        class="flex items-start gap-2"
                        @submit.prevent="doSearch"
                    >
                        <TextInput
                            v-model="query"
                            placeholder="Search for your book"
                            :disabled="isLoading"
                        />
                        <Button
                            variant="outline"
                            type="submit"
                            :disabled="isLoading"
                        >
                            <Loader2
                                v-if="isLoading"
                                class="size-4 animate-spin"
                            />
                            <Search
                                v-else
                                class="size-4"
                            />
                            Search
                        </Button>
                    </form>
                    <div>
                        <Button
                            variant="primary-outline"
                            size="sm"
                            @click="resetPage()"
                        >
                            <RotateCcw class="size-4" />
                            Reset
                        </Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>

        <template v-if="showSearchResults">
            <div
                v-if="results.length"
                class="divide-y divide-border rounded-lg border border-border"
            >
                <div
                    v-for="result in results"
                    :key="result.id"
                    class="flex
                        cursor-pointer
                        items-start
                        gap-2
                        p-4
                        transition-colors
                        hover:bg-muted/50"
                    @click="addBook(result)"
                >
                    <div class="hidden aspect-[3/4] h-48 sm:block">
                        <img
                            v-if="result.volumeInfo.imageLinks?.thumbnail"
                            :src="result.volumeInfo.imageLinks?.thumbnail"
                            class="size-full object-contain"
                        >
                        <div
                            v-else
                            class="flex
                                size-full
                                items-center
                                justify-center
                                rounded-lg
                                bg-muted"
                        >
                            <ImageOff class="size-8 text-muted-foreground" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-y-2">
                        <div class="text-xl font-medium">
                            {{ result.volumeInfo.title }}
                        </div>
                        <div
                            v-if="result.volumeInfo.subtitle"
                            class="text-lg italic text-muted-foreground"
                        >
                            {{ result.volumeInfo.subtitle }}
                        </div>
                        <div
                            v-if="result.volumeInfo.authors"
                            class="flex flex-wrap gap-x-2 gap-y-1"
                        >
                            <Badge
                                v-for="author in result.volumeInfo.authors"
                                :key="author"
                                variant="outline"
                            >
                                {{ author }}
                            </Badge>
                        </div>

                        <div class="h-48 sm:hidden">
                            <img
                                v-if="result.volumeInfo.imageLinks?.thumbnail"
                                :src="result.volumeInfo.imageLinks?.thumbnail"
                                class="size-full object-contain"
                            >
                        </div>
                        <div
                            v-if="result.volumeInfo.description"
                            class="line-clamp-3 text-ellipsis"
                        >
                            {{ result.volumeInfo.description }}
                        </div>

                        <div
                            class="flex
                                w-full
                                flex-col
                                items-center
                                justify-end
                                gap-2
                                sm:flex-row"
                        >
                            <Button
                                v-if="toLibrary"
                                variant="primary-outline"
                                class="w-full sm:w-fit"
                                @click.stop.prevent="addBook(result)"
                            >
                                <Library class="size-4" />
                                Save to library
                            </Button>
                            <Button
                                v-else
                                variant="primary-outline"
                                class="w-full sm:w-fit"
                                @click.stop.prevent="addBook(result)"
                            >
                                <Scroll class="size-4" />
                                Save to wishlist
                            </Button>
                            <Button
                                v-if="toLibrary"
                                variant="primary-outline"
                                class="w-full sm:w-fit"
                                @click.stop.prevent="addBook(result, true)"
                            >
                                <BookCheck class="size-4" />
                                Save as read
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="text-muted-foreground"
            >
                No results.
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { getLocalTimeZone, today, } from '@internationalized/date'
import { Barcode, BookCheck, ImageOff, Library, Loader2, RotateCcw, Scroll, Search, } from 'lucide-vue-next'

import { useToast, } from '~/components/ui/toast'
import { findBook, insertBook, patchBook, } from '~/lib/api/book'
import { getGoogleBook, searchBooks, } from '~/lib/api/googleBooks'
import { type BookEvent, BookEventTypeEnum, BookListEnum, BookSchema,  } from '~/lib/entities/book'
import { type BookVolume, } from '~/lib/entities/googleBooks'

const isbn = ref<string>()
const query = ref<string>()
const isLoading = ref<boolean>(false)
const showSearchResults = ref<boolean>(false)
const toLibrary = ref<boolean>(true)
const hideHint = ref<boolean>(false)
const setCurrentDate = ref<boolean>(false)

const searchResultsStore = useSearchResultsStore()
const { results, }: {results: Ref<BookVolume[]>} = storeToRefs(searchResultsStore)
const { toast, } = useToast()

const searchIsbn = (value: string) => {
    isbn.value = value
    query.value = `isbn:${isbn.value}`
    doSearch()
}

const doSearch = async () => {
    isLoading.value = true
    if (query.value) {
        results.value = await searchBooks(query.value)
        showSearchResults.value = true
    }
    isLoading.value = false
}

const resetPage = () => {
    isbn.value = ''
    query.value = ''
    results.value = []
    showSearchResults.value = false
}

const addBook = async (book: BookVolume, isRead?: boolean) => {
    if (isLoading.value) {
        return
    }

    isLoading.value = true
    const existingBook = await findBook(book.id)
    const bookList = toLibrary.value ? BookListEnum.Values.LIBRARY : BookListEnum.Values.WISHLIST
    let message = 'hallo'
    if (existingBook) {
        const updateData = {}
        console.log('existingBook', existingBook, bookList)
        if (existingBook.list === bookList) {
            // if the user clicked `read`, and the book wasn't read yet, we add it.
            // if the user didn't click `read`, but the book was read alrady, we DON'T delete it
            // if the user didn't click `read`, and the book wasn't read, we don't care
            if (isRead && !existingBook.events?.find((event) => event.event === BookEventTypeEnum.Values.READ)) {
                updateData.events = existingBook.events ?? []
                updateData.events.push({
                    event: BookEventTypeEnum.Values.READ,
                    date: setCurrentDate.value ? today(getLocalTimeZone()).toString() : null,
                })
                message = 'Updated existing book as read.'
            }
        } else {
            updateData.list = bookList
            updateData.events = existingBook.events ?? []
            if (bookList === BookListEnum.Values.LIBRARY) {
                updateData.events.push({
                    event: BookEventTypeEnum.Values.BOUGHT,
                    date: setCurrentDate.value ? today(getLocalTimeZone()).toString() : null,
                })
            } else {
                updateData.events = updateData.events.filter((event: BookEvent) => event.event !== BookEventTypeEnum.Values.BOUGHT)
            }
            if (isRead && !existingBook.events?.find((event) => event.event === BookEventTypeEnum.Values.READ)) {
                updateData.events.push({
                    event: BookEventTypeEnum.Values.READ,
                    date: setCurrentDate.value ? today(getLocalTimeZone()).toString() : null,
                })
                message = 'Updated existing book list & read status'
            } else {
                message = 'Updated existing book list'
            }
        }
        if (Object.keys(updateData).length) {
            patchBook(existingBook.id, updateData, false)
        } else {
            message = 'No changes made (book already in correct list & status)'
        }
    } else {
        const googleBook = await getGoogleBook(book.id)

        // create book
        const newBookData = {
            google_book_id: book.id,
            google_book_data: googleBook,
            list: bookList,
            events: [],
        }
        if (toLibrary.value) {
            newBookData.events.push({
                event: BookEventTypeEnum.Values.BOUGHT,
                date: setCurrentDate.value ? today(getLocalTimeZone()).toString() : null,
            })
        }
        if (isRead) {
            newBookData.events.push({
                event: BookEventTypeEnum.Values.READ,
                date: setCurrentDate.value ? today(getLocalTimeZone()).toString() : null,
            })
        }
        const newBook = BookSchema.parse(newBookData)
        await insertBook(newBook, false)
        message = 'Added the new book!'
    }

    toast({
        description: message,
        variant: 'success',
    })

    resetPage()

    isLoading.value = false
}

onMounted(() => {
    results.value = []
})

useHead({
    title: 'Inventory mode',
})
</script>
