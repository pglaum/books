<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        <div class="flex flex-wrap items-end gap-4">
            <H1>Library</H1>

            <div class="ms-auto flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    @click="dialogStore.showDialog('scan-book')"
                >
                    <Barcode class="size-4" />
                    Scan a book
                </Button>
                <Button
                    variant="outline"
                    @click="router.push('/search')"
                >
                    <Search class="size-4" />
                    Search for a book
                </Button>
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-4">
            <SelectInput
                v-model="orderBy"
                :options="orderByOptions"
                label="Order by"
                class="max-w-48"
                @update:model-value="reloadPage()"
            />
        </div>

        <div
            v-if="libraryLoading && !library.length"
            class="flex items-center gap-2"
        >
            <Loader2 class="size-4 animate-spin" />
            Loading
        </div>
        <div
            v-else-if="library && library.length"
            class="grid grid-cols-2 md:grid-cols-3"
        >
            <BookItem
                v-for="book in library"
                :key="book.google_book_id"
                :class="{
                    'handle': reorderItems
                }"
                :book="book"
            />
        </div>
        <div
            v-else
            class="text-muted-foreground"
        >
            No books on your library.
        </div>

        <ScanBookDialog
            v-if="scanBookDialogVisible"
            close-on-detect
            @scanned="(e) => navigateTo({path: '/search', query: {q:`isbn:${e}`}})"
        />
        <StoredBookDialog
            v-if="storedBookDialogVisible"
            @closed="loadBooks()"
        />
    </div>
</template>

<script setup lang="ts">
import { Barcode, Loader2, Search, } from 'lucide-vue-next'

import { getBooks, } from '~/lib/api/book'
import { type Book, BookListEnum, } from '~/lib/entities/book'

const route = useRoute()
const router = useRouter()
const dialogStore = useDialogStore()
const scanBookDialogVisible = dialogStore.isVisibleComputed('scan-book')
const storedBookDialogVisible = dialogStore.isVisibleComputed('stored-book')

const library = ref<Book[]>([])
const libraryLoading = ref<boolean>(true)
const isLoading = ref<boolean>(false)

const orderBy = ref<string>(route.query.orderBy?.toString() ?? 'title')
const orderByOptions = ref([
    { value: 'created', label: 'Created At', },
    { value: 'updated', label: 'Updated At', },
    { value: 'title', label: 'Title', },
])
const reorderItems = ref<boolean>(false)

watch(() => route.query.orderBy, (newValue) => {
    orderBy.value = newValue?.toString() ?? 'title'
    reloadPage()
})

const compare = (a, b) => {
    if (a > b) {
        return 1
    }
    if (a < b) {
        return -1
    }
    return 0
}

const loadBooks = async () => {
    libraryLoading.value = true
    library.value = (await getBooks(BookListEnum.Values.LIBRARY, 0)).sort((a, b) => {
        switch (orderBy.value) {
            case 'created':
                return compare(b.created_at, a.created_at)
            case 'title':
                return compare(a.google_book_data.volumeInfo.title, b.google_book_data.volumeInfo.title)
            default:
                return compare(b.updated_at, a.updated_at)
        }
    })
    libraryLoading.value = false
}

const reloadPage = () => {
    const navTo = {
        path: route.path,
        query: {
            ...route.query,
            orderBy: orderBy.value,
        },
    }
    if (!orderBy.value) {
        delete navTo.query.orderBy
    }
    navigateTo(navTo)
    loadBooks()
}

onMounted(() => {
    loadBooks()
})

useHead({
    title: 'Books',
})
</script>
