<template>
    <div class="container my-24 grid max-w-3xl gap-8">
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
                    v-model="query"
                    placeholder="Search"
                />
                <Button
                    variant="outline"
                    type="submit"
                >
                    <Search class="size-4" />
                    Search
                </Button>
            </form>
        </div>

        <div class="grid gap-4">
            <div class="flex flex-wrap justify-between">
                <H2>Wishlist</H2>

                <NuxtLink
                    class="inline-flex
                        items-center
                        gap-2
                        text-primary
                        underline-offset-4
                        hover:underline"
                    to="/wishlist"
                >
                    Show all
                    <ArrowRight class="size-4" />
                </NuxtLink>
            </div>

            <div
                v-if="wishlistLoading"
                class="flex items-center gap-2"
            >
                <Loader2 class="size-4 animate-spin" />
                Loading
            </div>
            <div
                v-else-if="wishlist && wishlist.length"
                class="grid grid-cols-2 gap-2 md:grid-cols-3"
            >
                <BookItem
                    v-for="book in wishlist"
                    :key="book.google_book_id"
                    :book="book"
                />
            </div>
            <div
                v-else
                class="text-muted-foreground"
            >
                No books on your wishlist.
            </div>
        </div>

        <div class="grid gap-4">
            <div class="flex flex-wrap justify-between">
                <H2>Library</H2>

                <NuxtLink
                    class="inline-flex
                        items-center
                        gap-2
                        text-primary
                        underline-offset-4
                        hover:underline"
                    to="/library"
                >
                    Show all
                    <ArrowRight class="size-4" />
                </NuxtLink>
            </div>


            <div
                v-if="libraryLoading"
                class="flex items-center gap-2"
            >
                <Loader2 class="size-4 animate-spin" />
                Loading
            </div>
            <div
                v-else-if="library && library.length"
                class="grid grid-cols-2 gap-2 md:grid-cols-3"
            >
                <BookItem
                    v-for="book in library"
                    :key="book.google_book_id"
                    :book="book"
                />
            </div>
            <div
                v-else
                class="text-muted-foreground"
            >
                No books in your library.
            </div>
        </div>

        <ScanBookDialog
            v-if="scanBookDialogVisible"
            close-on-detect
            @scanned="(e) => router.push(`/search?q=isbn:${e}`)"
        />
        <StoredBookDialog
            v-if="storedBookDialogVisible"
            @closed="loadBooks"
        />
    </div>
</template>

<script setup lang="ts">
import { ArrowRight, Barcode, Loader2, Search, } from 'lucide-vue-next'

import { getBooks, } from '~/lib/api/book'
import { type Book, BookListEnum, } from '~/lib/entities/book'

const router = useRouter()
const dialogStore = useDialogStore()
const scanBookDialogVisible = dialogStore.isVisibleComputed('scan-book')
const storedBookDialogVisible = dialogStore.isVisibleComputed('stored-book')

const wishlist = ref<Book[]>([])
const wishlistLoading = ref<boolean>(true)
const library = ref<Book[]>([])
const libraryLoading = ref<boolean>(true)

const query = ref('')

const doSearch = () => {
    router.push(`/search?q=${query.value}`)
}

const loadBooks = () => {
    getBooks(BookListEnum.Values.LIBRARY).then((result) => {
        library.value = result
        libraryLoading.value = false
    })
    getBooks(BookListEnum.Values.WISHLIST).then((result) => {
        wishlist.value = result
        wishlistLoading.value = false
    })
}

onMounted(() => {
    loadBooks()
})

useHead({
    title: 'Books',
})
</script>
