<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        <H1>Inventory mode</H1>

        <div>
            <CheckInput
                v-model="toLibrary"
                label="Save to library"
            />
        </div>

        <div class="grid gap-4">
            <div>
                <Button
                    @click="dialogStore.showDialog('scan-book')"
                >
                    <Barcode class="size-4" />
                    Scan a book
                </Button>
            </div>
            <form
                class="flex items-start gap-2"
                @submit.prevent="doSearch"
            >
                <TextInput
                    v-model="search"
                    placeholder="Use 'isbn:1234567890' to search for a specific ISBN"
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
        </div>

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
                    items-center
                    gap-2
                    px-4
                    py-2
                    transition-colors
                    hover:bg-muted/50"
                @click="dialogStore.showDialog('searched-book', result)"
            >
                <div class="aspect-[3/4] h-32">
                    <img
                        v-if="result.volumeInfo.imageLinks?.thumbnail"
                        :src="result.volumeInfo.imageLinks?.thumbnail"
                        class="size-full object-contain"
                    >
                    <div
                        v-else
                        class="flex size-full items-center justify-center rounded-lg bg-muted"
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
                    <div
                        v-if="result.volumeInfo.description"
                        class="line-clamp-3 text-ellipsis"
                    >
                        {{ result.volumeInfo.description }}
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

        <ScanBookDialog
            v-if="scanBookDialogVisible"
            close-on-detect
            @scanned="(e) => navigateTo({path: '/search', query: {q: `isbn:${e}`}})"
        />
        <SearchedBookDialog v-if="searchedBookDialogVisible" />
    </div>
</template>

<script setup lang="ts">
import { Barcode, ImageOff, Loader2, Search, } from 'lucide-vue-next'

import { searchBooks, } from '~/lib/api/googleBooks'
import { type BookVolume, } from '~/lib/entities/googleBooks'

const route = useRoute()
const search = ref<string>('')
const isLoading = ref<boolean>(false)
const toLibrary = ref<boolean>(true)

const dialogStore = useDialogStore()
const scanBookDialogVisible = dialogStore.isVisibleComputed('scan-book')
const searchedBookDialogVisible = dialogStore.isVisibleComputed('searched-book')

const searchResultsStore = useSearchResultsStore()
const { results, }: {results: Ref<BookVolume[]>} = storeToRefs(searchResultsStore)

const doSearch = async () => {
    isLoading.value = true
    results.value = []
    results.value = await searchBooks(search.value)
    isLoading.value = false
}

onMounted(() => {
    if (route.query && route.query.q) {
        search.value = route.query.q as string
        doSearch()
    }
})

useHead({
    title: 'Inventory mode',
})
</script>
