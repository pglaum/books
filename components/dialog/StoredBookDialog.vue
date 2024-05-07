<template>
    <GDialog large>
        <template #title>
            {{ vi.title }}
        </template>
        <template
            v-if="vi.subtitle"
            #description
        >
            {{ vi.subtitle }}
        </template>

        <template #body>
            <div class="flex items-center justify-center">
                <img
                    v-if="vi.imageLinks?.thumbnail"
                    :src="vi.imageLinks?.thumbnail"
                    class="float-left me-2 h-48"
                >
            </div>

            <div class="grid gap-2">
                <div
                    v-if="book.list === BookListEnum.Values.LIBRARY"
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
                    v-else-if="book.list === BookListEnum.Values.WISHLIST"
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
                    v-if="book.is_read"
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
                v-if="vi.description"
                class="prose"
                v-html="vi.description"
            />
            <Table>
                <TableBody>
                    <TableRow v-if="vi.authors">
                        <TableHead>Author(s)</TableHead>
                        <TableCell>{{ vi.authors.join(', ') }}</TableCell>
                    </TableRow>
                    <TableRow v-if="vi.publisher">
                        <TableHead>Publisher</TableHead>
                        <TableCell>{{ vi.publisher }}</TableCell>
                    </TableRow>
                    <TableRow v-if="vi.publishedDate">
                        <TableHead>Published date</TableHead>
                        <TableCell>{{ vi.publishedDate }}</TableCell>
                    </TableRow>
                    <TableRow v-if="vi.pageCount">
                        <TableHead>Pages</TableHead>
                        <TableCell>{{ vi.pageCount }}</TableCell>
                    </TableRow>
                    <TableRow v-if="vi.categories">
                        <TableHead>Pages</TableHead>
                        <TableCell>{{ vi.categories.join(', ') }}</TableCell>
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
import { BookCheck,
         BookDashed, CheckCircle, Scroll,
         Trash2, } from 'lucide-vue-next'

import { deleteBook, patchBook, } from '~/lib/api/book'
import { type Book, type BookList, BookListEnum, BookSchema,  } from '~/lib/entities/book'

const router = useRouter()
const dialogStore = useDialogStore()
const { dialogData: book, }: {dialogData: Ref<Book>} = storeToRefs(dialogStore)

const isLoading = ref<boolean>(false)
const showReallyDelete = ref<boolean>(false)

const vi = computed(() => book.value.google_book_data.volumeInfo)

const readBook = async (is_read: boolean) => {
    isLoading.value = true
    const { data, } = await patchBook(book.value.id, { is_read, })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const setList = async (list: BookList) => {
    isLoading.value = true
    const { data, } = await patchBook(book.value.id, { list, })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const removeBook = async () => {
    isLoading.value = true
    await deleteBook(book.value.id)
    isLoading.value = false
    dialogStore.closeDialog()
}
</script>
