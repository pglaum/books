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

        <div>
            <CheckInput
                v-model="toLibrary"
                label="Save to library"
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
                v-if="isLoading"
                class="flex items-center justify-center gap-2"
            >
                <Loader2 class="size-4 animate-spin" />
                Loading
            </div>
            <div
                v-else-if="results.length"
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
                    @click="console.log('add book')"
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
                                @click.stop.prevent="console.log('save book')"
                            >
                                <Library class="size-4" />
                                Save to library
                            </Button>
                            <Button
                                v-else
                                variant="primary-outline"
                                class="w-full sm:w-fit"
                                @click.stop.prevent="console.log('save book')"
                            >
                                <Scroll class="size-4" />
                                Save to wishlist
                            </Button>
                            <Button
                                v-if="toLibrary"
                                variant="primary-outline"
                                class="w-full sm:w-fit"
                                @click.stop.prevent="console.log('save as read')"
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
import { Barcode, BookCheck, ImageOff, Library, Loader2, RotateCcw, Scroll, Search, } from 'lucide-vue-next'

import { searchBooks, } from '~/lib/api/googleBooks'
import { type BookVolume, } from '~/lib/entities/googleBooks'

const isbn = ref<string>()
const query = ref<string>()
const isLoading = ref<boolean>(false)
const showSearchResults = ref<boolean>(false)
const toLibrary = ref<boolean>(true)
const hideHint = ref<boolean>(false)

const dialogStore = useDialogStore()

const searchResultsStore = useSearchResultsStore()
const { results, }: {results: Ref<BookVolume[]>} = storeToRefs(searchResultsStore)

const searchIsbn = (value: string) => {
    isbn.value = value
    query.value = `isbn:${isbn.value}`
    doSearch()
}

const doSearch = async () => {
    isLoading.value = true
    if (query.value) {
        showSearchResults.value = true
        results.value = await searchBooks(query.value)
    }
    isLoading.value = false
}

const resetPage = () => {
    isbn.value = ''
    query.value = ''
    results.value = []
    showSearchResults.value = false
}

onMounted(() => {
    results.value = []
})

useHead({
    title: 'Inventory mode',
})
</script>
