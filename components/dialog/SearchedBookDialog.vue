<template>
    <GDialog large>
        <template #title>
            {{ gbook.volumeInfo.title }}
        </template>
        <template
            v-if="gbook.volumeInfo.subtitle"
            #description
        >
            {{ gbook.volumeInfo.subtitle }}
        </template>

        <template #body>
            <div class="clear-both">
                <img
                    v-if="gbook.volumeInfo.imageLinks?.thumbnail"
                    :src="gbook.volumeInfo.imageLinks?.thumbnail"
                    class="float-left me-2 h-48"
                >
                <div
                    v-if="gbook.volumeInfo.description"
                    class="prose"
                    v-html="gbook.volumeInfo.description"
                />

                <div v-if="existingBook">
                    <pre>{{ existingBook }}</pre>
                </div>
                <div
                    v-else
                    class="mt-4 flex flex-wrap gap-2"
                >
                    <Button
                        variant="primary-outline"
                        :disabled="isLoading"
                        @click="createBook(false, false)"
                    >
                        <Scroll class="size-4" />
                        Wishlist
                    </Button>
                    <Button
                        variant="primary-outline"
                        :disabled="isLoading"
                        @click="createBook(true, false)"
                    >
                        <Library class="size-4" />
                        Library
                    </Button>
                    <Button
                        variant="primary-outline"
                        :disabled="isLoading"
                        @click="createBook(true, true)"
                    >
                        <BookCheck class="size-4" />
                        Library & read
                    </Button>
                </div>
            </div>

            <Table>
                <TableBody>
                    <TableRow v-if="gbook.volumeInfo.authors">
                        <TableHead>Author(s)</TableHead>
                        <TableCell>{{ gbook.volumeInfo.authors.join(', ') }}</TableCell>
                    </TableRow>
                    <TableRow v-if="gbook.volumeInfo.publisher">
                        <TableHead>Publisher</TableHead>
                        <TableCell>{{ gbook.volumeInfo.publisher }}</TableCell>
                    </TableRow>
                    <TableRow v-if="gbook.volumeInfo.publishedDate">
                        <TableHead>Published date</TableHead>
                        <TableCell>{{ gbook.volumeInfo.publishedDate }}</TableCell>
                    </TableRow>
                    <TableRow v-if="gbook.volumeInfo.pageCount">
                        <TableHead>Pages</TableHead>
                        <TableCell>{{ gbook.volumeInfo.pageCount }}</TableCell>
                    </TableRow>
                    <TableRow v-if="gbook.volumeInfo.categories">
                        <TableHead>Pages</TableHead>
                        <TableCell>{{ gbook.volumeInfo.categories.join(', ') }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </template>

        <template #footer>
            <Button
                variant="outline"
                @click="dialogStore.closeDialog()"
            >
                Abbrechen
            </Button>
        </template>
    </GDialog>
</template>

<script setup lang="ts">
import { BookCheck, Library, Scroll, } from 'lucide-vue-next'

import { findBook, insertBook, } from '~/lib/api/book'
import { getGoogleBook, } from '~/lib/api/googleBooks'
import { type Book, BookListEnum, BookSchema,   } from '~/lib/entities/book'
import { type BookVolume,  } from '~/lib/entities/googleBooks'

const router = useRouter()
const dialogStore = useDialogStore()
const { dialogData: book, }: {dialogData: Ref<BookVolume>} = storeToRefs(dialogStore)

const existingBook = ref<Book|null>(null)
const googleBook = ref<BookVolume|null>(null)
const isLoading = ref<boolean>(false)

const gbook = computed(() => googleBook.value ?? book.value)

onMounted(() => {
    findBook(book.value.id).then((result) => existingBook.value = result)
    getGoogleBook(book.value.id).then((result) => googleBook.value = result)
})

const createBook = async (inLibrary: boolean, read: boolean) => {
    isLoading.value = true

    if (!googleBook.value) {
        googleBook.value = await getGoogleBook(book.value.id)
    }

    // create book
    const newBookData = {
        google_book_id: book.value.id,
        google_book_data: googleBook.value,
        list: inLibrary ? BookListEnum.Values.LIBRARY : BookListEnum.Values.WISHLIST,
        is_read: read,
    }
    const newBook = BookSchema.parse(newBookData)
    insertBook(newBook)

    if (inLibrary) {
        // go to library
    } else {
        // go to wishlist
    }

    isLoading.value = false
}
</script>
