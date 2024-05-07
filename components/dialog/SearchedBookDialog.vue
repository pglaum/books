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
            <div
                v-if="existingBook"
                class="grid gap-2"
            >
                <div
                    v-if="existingBook.list === BookListEnum.Values.LIBRARY"
                    class="flex items-center gap-4"
                >
                    <div class="flex items-center gap-2 text-success">
                        <CheckCircle class="size-4" />
                        This book is in your library
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="isLoading"
                        @click="setList(BookListEnum.Values.WISHLIST)"
                    >
                        Move to wishlist
                    </Button>
                </div>
                <div
                    v-else-if="existingBook.list === BookListEnum.Values.WISHLIST"
                    class="flex items-center gap-4"
                >
                    <div class="flex items-center gap-2 text-muted-foreground">
                        <Scroll class="size-4" />
                        This book is on your wishlist
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="isLoading"
                        @click="setList(BookListEnum.Values.LIBRARY)"
                    >
                        Add to library
                    </Button>
                </div>
                <div
                    v-if="existingBook.is_read"
                    class="flex items-center gap-4"
                >
                    <div class="flex items-center gap-2 text-success">
                        <BookCheck class="size-4" />
                        You've read the book
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="isLoading"
                        @click="readBook(false)"
                    >
                        Mark as unread
                    </Button>
                </div>
                <div
                    v-else
                    class="flex items-center gap-4"
                >
                    <div class="flex items-center gap-2 text-muted-foreground">
                        <BookDashed class="size-4" />
                        You haven't read this book yet
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="isLoading"
                        @click="readBook(true)"
                    >
                        Mark as read
                    </Button>
                </div>
                <div class="flex items-center gap-4">
                    <Button
                        variant="destructive-outline"
                        size="sm"
                        @click="showReallyDelete = true"
                    >
                        <Trash2 class="size-4" />
                        Delete
                    </Button>
                    <div
                        v-if="showReallyDelete"
                        class="flex items-center gap-2"
                    >
                        Do you really want to delete this book?
                        <Button
                            variant="destructive-outline"
                            size="sm"
                            :disabled="isLoading"
                            @click="removeBook()"
                        >
                            Yes
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            @click="showReallyDelete=false"
                        >
                            No
                        </Button>
                    </div>
                </div>
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
import { BookCheck, BookDashed, CheckCircle, Library, Scroll, Trash2, } from 'lucide-vue-next'

import { deleteBook, findBook, insertBook, patchBook, } from '~/lib/api/book'
import { getGoogleBook, } from '~/lib/api/googleBooks'
import { type Book, type BookList, BookListEnum, BookSchema,    } from '~/lib/entities/book'
import { type BookVolume,  } from '~/lib/entities/googleBooks'

const router = useRouter()
const dialogStore = useDialogStore()
const { dialogData: book, }: {dialogData: Ref<BookVolume>} = storeToRefs(dialogStore)

const existingBook = ref<Book|null>(null)
const googleBook = ref<BookVolume|null>(null)
const isLoading = ref<boolean>(false)
const showReallyDelete = ref<boolean>(false)

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

const readBook = async (is_read: boolean) => {
    isLoading.value = true
    const { data, } = await patchBook(existingBook.value.id, { is_read, })
    existingBook.value = BookSchema.parse(data)
    isLoading.value = false
}

const setList = async (list: BookList) => {
    isLoading.value = true
    const { data, } = await patchBook(existingBook.value.id, { list, })
    existingBook.value = BookSchema.parse(data)
    isLoading.value = false
}

const removeBook = async () => {
    isLoading.value = true
    await deleteBook(existingBook.value.id)
    isLoading.value = false
    dialogStore.closeDialog()
}
</script>
