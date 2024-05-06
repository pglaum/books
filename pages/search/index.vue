<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        <form
            class="flex items-start gap-2"
            @submit.prevent="doSearch"
        >
            <TextInput
                v-model="search"
                description="Use 'isbn:1234567890' to search for a specific ISBN"
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

        <div class="divide-y divide-border rounded-lg border border-border">
            <div
                v-for="result in results"
                :key="result.id"
                class="flex
                    cursor-pointer
                    items-center
                    gap-4
                    px-4
                    py-2
                    transition-colors
                    hover:bg-muted/50"
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
    </div>
</template>

<script setup lang="ts">
import { ImageOff, Loader2, Search, } from 'lucide-vue-next'

import { searchBooks, } from '~/lib/api/googleBooks'
import { type BookVolume, } from '~/lib/entities/googleBooks'

const route = useRoute()
const search = ref<string>('')
const isLoading = ref<boolean>(false)

const searchResultsStore = useSearchResultsStore()
const { results, }: {results: Ref<BookVolume[]>} = storeToRefs(searchResultsStore)

const doSearch = async () => {
    isLoading.value = true
    results.value = await searchBooks(search.value)
    isLoading.value = false
}

onMounted(() => {
    if (route.query && route.query.q) {
        search.value = route.query.q as string
        doSearch()
    }
})
</script>
