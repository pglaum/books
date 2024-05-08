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
                    class="flex items-center gap-4"
                >
                    <div
                        v-if="existingBook.list === BookListEnum.Values.LIBRARY"
                        class="flex items-center gap-2 text-success"
                    >
                        <CheckCircle class="size-4" />
                        This book is in your library
                    </div>
                    <div
                        v-else-if="existingBook.list === BookListEnum.Values.WISHLIST"
                        class="flex items-center gap-2 text-muted-foreground"
                    >
                        <Scroll class="size-4" />
                        This book is on your wishlist
                    </div>
                </div>
                <div
                    class="flex items-center gap-4"
                >
                    <div
                        v-if="existingBook.events?.find((event) => event.event === BookEventTypeEnum.Values.READ)"
                        class="flex items-center gap-2 text-success"
                    >
                        <BookCheck class="size-4" />
                        You've read the book
                    </div>
                    <div
                        v-else
                        class="flex items-center gap-2 text-muted-foreground"
                    >
                        <BookDashed class="size-4" />
                        You haven't read this book yet
                    </div>
                </div>

                <div>
                    <CheckInput
                        v-model="moreOptions"
                        label="More options"
                    />
                </div>

                <div class="flex items-center gap-x-4 gap-y-2">
                    <Button
                        v-if="!existingBook.events?.find((event) => event.event === BookEventTypeEnum.Values.BOUGHT)"
                        :disabled="isLoading"
                        variant="outline"
                        size="sm"
                        @click="addToLibrary()"
                    >
                        <Library class="size-4" />
                        Add to library
                    </Button>
                    <Button
                        v-if="existingBook.list === BookListEnum.Values.LIBRARY && moreOptions"
                        :disabled="isLoading"
                        variant="outline"
                        size="sm"
                        @click="moveToWishlist()"
                    >
                        <Scroll class="size-4" />
                        Move to wishlist
                    </Button>
                    <Button
                        :disabled="isLoading"
                        variant="outline"
                        size="sm"
                        @click="markAsRead()"
                    >
                        <BookCheck class="size-4" />
                        Read
                    </Button>
                </div>

                <div class="divide-y">
                    <div
                        v-for="event, index in existingBook.events"
                        :key="index"
                        class="flex flex-wrap gap-2 py-2"
                    >
                        <Button
                            v-if="moreOptions"
                            :disabled="isLoading"
                            variant="destructive-outline"
                            size="icon"
                            @click="removeEvent(index)"
                        >
                            <Trash2 class="size-4" />
                        </Button>
                        <Badge
                            variant="secondary"
                            class="me-auto"
                        >
                            {{ event.event }}
                        </Badge>
                        <DateInput v-model="event.date" />
                        <Button
                            v-if="event.date"
                            :disabled="isLoading"
                            variant="ghost"
                            size="icon"
                            @click="event.date = null; updateEvents()"
                        >
                            <X class="size-4" />
                        </Button>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <Button
                        v-if="moreOptions"
                        variant="destructive-outline"
                        size="sm"
                        @click="showReallyDelete = !showReallyDelete"
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
import { getLocalTimeZone, today, } from '@internationalized/date'
import { BookCheck, BookDashed, CheckCircle, Library, Scroll, Trash2, X, } from 'lucide-vue-next'

import { deleteBook, findBook, insertBook, patchBook, } from '~/lib/api/book'
import { getGoogleBook, } from '~/lib/api/googleBooks'
import { type Book, BookListEnum, BookSchema,    } from '~/lib/entities/book'
import { BookEventTypeEnum, } from '~/lib/entities/book'
import { type BookVolume,  } from '~/lib/entities/googleBooks'


const router = useRouter()
const dialogStore = useDialogStore()
const { dialogData: book, }: {dialogData: Ref<BookVolume>} = storeToRefs(dialogStore)

const existingBook = ref<Book|null>(null)
const googleBook = ref<BookVolume|null>(null)
const isLoading = ref<boolean>(false)
const showReallyDelete = ref<boolean>(false)
const moreOptions = ref<boolean>(false)

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
        events: [],
    }
    if (inLibrary) {
        newBookData.events.push({
            event: BookEventTypeEnum.Values.BOUGHT,
            date: null,
        })
    }
    if (read) {
        newBookData.events.push({
            event: BookEventTypeEnum.Values.READ,
            date: null,
        })
    }
    const newBook = BookSchema.parse(newBookData)
    insertBook(newBook)

    if (inLibrary) {
        navigateTo('/library')
    } else {
        navigateTo('/wishlist')
    }

    isLoading.value = false
}

const addToLibrary = async () => {
    isLoading.value = true
    const events = existingBook.value.events ?? []
    const { data, } = await patchBook(existingBook.value.id, {
        list: BookListEnum.Values.LIBRARY,
        events: [
            ...events,
            {
                date: today(getLocalTimeZone()).toString(),
                event: BookEventTypeEnum.Values.BOUGHT,
            },
        ],
    })
    existingBook.value = BookSchema.parse(data)
    isLoading.value = false
}

const moveToWishlist = async () => {
    isLoading.value = true
    const events = existingBook.value.events?.filter((event) => event.event !== BookEventTypeEnum.Values.BOUGHT) ?? []
    const { data, } = await patchBook(existingBook.value.id, {
        list: BookListEnum.Values.WISHLIST,
        events: events,
    })
    existingBook.value = BookSchema.parse(data)
    isLoading.value = false
}

const markAsRead = async () => {
    isLoading.value = true
    const events = existingBook.value.events ?? []
    const { data, } = await patchBook(existingBook.value.id, {
        events: [
            ...events,
            {
                date: today(getLocalTimeZone()).toString(),
                event: BookEventTypeEnum.Values.READ,
            },
        ],
    })
    existingBook.value = BookSchema.parse(data)
    isLoading.value = false
}

const removeBook = async () => {
    isLoading.value = true
    await deleteBook(existingBook.value.id)
    isLoading.value = false
    dialogStore.closeDialog()
}

const removeEvent = async (index: number) => {
    isLoading.value = true
    existingBook.value.events.splice(index, 1)
    const { data, } = await patchBook(existingBook.value.id, {
        events: existingBook.value.events,
    })
    existingBook.value = BookSchema.parse(data)
    isLoading.value = false
}

const updateEvents = async () => {
    isLoading.value = true
    const { data, } = await patchBook(existingBook.value.id, {
        events: existingBook.value.events,
    })
    existingBook.value = BookSchema.parse(data)
    isLoading.value = false
}
</script>
