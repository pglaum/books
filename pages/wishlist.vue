<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        <div class="flex flex-wrap items-end gap-4">
            <H1>Wishlist</H1>

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
                :disabled="isLoading"
                label="Order by"
                placeholder="Manual"
                class="max-w-48"
                allow-clear
                @update:model-value="reloadPage()"
            />
            <div
                v-if="orderBy === ''"
                class="ms-auto flex gap-2"
            >
                <Button
                    v-if="!reorderItems"
                    variant="outline"
                    size="sm"
                    :disabled="isLoading"
                    @click="reorderItems=true"
                >
                    Reorder
                </Button>
                <Button
                    v-else
                    size="sm"
                    :disabled="isLoading"
                    @click="saveOrder()"
                >
                    Save order
                </Button>
                <Button
                    v-if="reorderItems"
                    variant="outline"
                    size="sm"
                    :disabled="isLoading"
                    @click="loadBooks(); reorderItems = false"
                >
                    Cancel
                </Button>
            </div>
        </div>

        <div
            v-if="wishlistLoading && !wishlist.length"
            class="flex items-center gap-2"
        >
            <Loader2 class="size-4 animate-spin" />
            Loading
        </div>
        <ClientOnly v-else-if="wishlist && wishlist.length">
            <draggable
                :animation="200"
                group="wishlist"
                ghost-class="bg-muted"
                handle=".handle"
                tag="div"
                class="grid grid-cols-2 md:grid-cols-3"
                :list="wishlist"
                @start="dragging = true"
                @end="dragging = false"
            >
                <BookItem
                    v-for="book in wishlist"
                    :key="book.google_book_id"
                    :class="{
                        'handle': reorderItems
                    }"
                    :book="book"
                />
            </draggable>
        </ClientOnly>
        <div
            v-else
            class="text-muted-foreground"
        >
            No books on your wishlist.
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

const configStore = useConfigStore()
const { wishlistOrder, } = storeToRefs(configStore)

const dialogStore = useDialogStore()
const scanBookDialogVisible = dialogStore.isVisibleComputed('scan-book')
const storedBookDialogVisible = dialogStore.isVisibleComputed('stored-book')

const wishlist = ref<Book[]>([])
const wishlistLoading = ref<boolean>(true)
const isLoading = ref<boolean>(false)

const dragging = ref<boolean>(false)
const orderBy = ref<string>(route.query.orderBy?.toString() ?? '')
const orderByOptions = ref([
    { value: 'created', label: 'Created At', },
    { value: 'updated', label: 'Updated At', },
    { value: 'title', label: 'Title', },
])
const reorderItems = ref<boolean>(false)

watch(() => route.query.orderBy, (newValue) => {
    orderBy.value = newValue?.toString() ?? ''
    reloadPage()
})

const compare = (a: any, b: any): number => {
    if (a > b) {
        return 1
    }
    if (a < b) {
        return -1
    }
    return 0
}

const loadBooks = async () => {
    wishlistLoading.value = true
    wishlist.value = (await getBooks(BookListEnum.Values.WISHLIST, 0)).sort((a, b) => {
        switch (orderBy.value) {
            case 'updated':
                return compare(b.updated_at, a.updated_at)
            case 'created':
                return compare(b.created_at, a.created_at)
            case 'title':
                return compare(a.google_book_data.volumeInfo.title, b.google_book_data.volumeInfo.title)
        }
        return 0
    })
    if (orderBy.value === '') {
        try {
            await configStore.getWishlistOrder()
            const res: Array<Book> = []
            wishlistOrder.value.forEach((id) => {
                const idx = wishlist.value.findIndex((book) => book.id === id)
                if (idx >= 0 && !res.find((b) => b.id === id)) {
                    res.push(wishlist.value[idx])
                }
            })
            wishlist.value.forEach((book) => {
                if (!res.find((b) => b.id === book.id)){
                    res.push(book)
                }
            })
            wishlist.value = res
        } catch (e) {
            console.error(e)
        }
    }
    wishlistLoading.value = false
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
    reorderItems.value = false
    navigateTo(navTo)
    loadBooks()
}

const saveOrder = () => {
    isLoading.value = true
    const order = wishlist.value.map((book) => book.id)
    configStore.setWishlistOrder(order)
    reorderItems.value = false
    isLoading.value = false
}

onMounted(() => {
    loadBooks()
})

useHead({
    title: 'Books',
})
</script>
