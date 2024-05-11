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
            <div class="flex flex-col gap-4">
                <div class="flex flex-col items-center justify-start gap-4 sm:flex-row sm:items-start">
                    <div
                        v-if="vi.imageLinks?.thumbnail"
                        class="aspect-[3/4] h-48"
                    >
                        <img
                            :src="vi.imageLinks?.thumbnail"
                            class="size-full object-contain object-center"
                        >
                    </div>

                    <div class="grid w-full gap-2">
                        <div
                            class="flex items-center gap-4"
                        >
                            <div
                                v-if="book.list === BookListEnum.Values.LIBRARY"
                                class="flex items-center gap-2 text-success"
                            >
                                <CheckCircle class="size-4" />
                                This book is in your library
                            </div>
                            <div
                                v-else-if="book.list === BookListEnum.Values.WISHLIST"
                                class="flex items-center gap-2 text-muted-foreground"
                            >
                                <Scroll class="size-4" />
                                This book is on your wishlist
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div
                                v-if="book.events?.find((event) => event.event === BookEventTypeEnum.Values.READ)"
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

                        <div class="flex items-center gap-x-4 gap-y-2">
                            <Button
                                v-if="!book.events?.find((event) => event.event === BookEventTypeEnum.Values.BOUGHT)"
                                :disabled="isLoading"
                                variant="outline"
                                size="sm"
                                @click="addToLibrary()"
                            >
                                <Library class="size-4" />
                                Add to library
                            </Button>
                            <Button
                                v-if="book.list === BookListEnum.Values.LIBRARY && moreOptions"
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
                            <CheckInput
                                v-model="moreOptions"
                                label="More options"
                            />
                        </div>

                        <div class="divide-y">
                            <div
                                v-for="event, index in book.events"
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
                                <DateInput
                                    v-model="event.date"
                                    @update:model-value="updateEvents()"
                                />
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
                </div>

                <div class="flex flex-col gap-4">
                    <H4 class="flex gap-2">
                        Notes
                    </H4>

                    <ClientOnly v-if="book.notes && book.notes.length">
                        <draggable
                            :animation="200"
                            group="wishlist"
                            ghost-class="bg-muted"
                            handle=".handle"
                            tag="div"
                            class="flex flex-col gap-2"
                            :list="book.notes"
                            @start="dragging = true"
                            @end="dragging = false"
                            @change="saveNotes"
                        >
                            <div
                                v-for="note, index in book.notes"
                                :key="index"
                                class="flex flex-col gap-2 bg-background"
                            >
                                <div class="flex items-center gap-2">
                                    <GripVertical
                                        class="size-4 hover:bg-muted/50"
                                        :class="{
                                            'handle': !isLoading,
                                            'cursor-not-allowed': isLoading,
                                        }"
                                    />
                                    <div class="w-full">
                                        <TextAreaInput
                                            v-if="index == editedNote"
                                            v-model="noteValue"
                                        />
                                        <Blockquote v-else>
                                            {{ note }}
                                        </Blockquote>
                                    </div>
                                </div>
                                <div class="flex justify-end gap-2">
                                    <Button
                                        v-if="index == editedNote"
                                        variant="primary-outline"
                                        size="sm"
                                        :disabled="isLoading"
                                        @click="saveNotes()"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        v-else
                                        variant="outline"
                                        size="sm"
                                        :disabled="isLoading"
                                        @click="editNote(index)"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        v-if="index == editedNote"
                                        variant="outline"
                                        size="sm"
                                        :disabled="isLoading"
                                        @click="editedNote = -1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        v-else
                                        variant="destructive-outline"
                                        size="sm"
                                        :disabled="isLoading"
                                        @click="removeNote(index)"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </draggable>
                    </ClientOnly>

                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            :disabled="isLoading"
                            @click="addNote()"
                        >
                            <Plus class="size-4" />
                            New note
                        </Button>
                    </div>
                </div>

                <Collapsible v-model:open="isOpen">
                    <CollapsibleTrigger
                        as-child
                    >
                        <Button variant="outline">
                            Show details
                            <ChevronsUpDown class="size-4" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent class="mt-4 grid gap-4">
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
                    </CollapsibleContent>
                </Collapsible>
            </div>
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
import { BookCheck, BookDashed, CheckCircle, ChevronsUpDown, GripVertical, Library, Plus, Scroll, Trash2, X, } from 'lucide-vue-next'

import { deleteBook, patchBook, } from '~/lib/api/book'
import { type Book, BookListEnum, BookSchema,  } from '~/lib/entities/book'
import { BookEventTypeEnum, } from '~/lib/entities/book'

const router = useRouter()
const dialogStore = useDialogStore()
const { dialogData: book, }: {dialogData: Ref<Book>} = storeToRefs(dialogStore)

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)
const moreOptions = ref<boolean>(false)
const dragging = ref<boolean>(false)
const showReallyDelete = ref<boolean>(false)
const editedNote = ref<number>(-1)
const noteValue = ref<string>()

const vi = computed(() => book.value.google_book_data.volumeInfo)

const addToLibrary = async () => {
    isLoading.value = true
    const events = book.value.events ?? []
    const { data, } = await patchBook(book.value.id, {
        list: BookListEnum.Values.LIBRARY,
        events: [
            ...events,
            {
                date: today(getLocalTimeZone()).toString(),
                event: BookEventTypeEnum.Values.BOUGHT,
            },
        ],
    })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const moveToWishlist = async () => {
    isLoading.value = true
    const events = book.value.events?.filter((event) => event.event !== BookEventTypeEnum.Values.BOUGHT) ?? []
    const { data, } = await patchBook(book.value.id, {
        list: BookListEnum.Values.WISHLIST,
        events: events,
    })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const markAsRead = async () => {
    isLoading.value = true
    const events = book.value.events ?? []
    const { data, } = await patchBook(book.value.id, {
        events: [
            ...events,
            {
                date: today(getLocalTimeZone()).toString(),
                event: BookEventTypeEnum.Values.READ,
            },
        ],
    })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const removeBook = async () => {
    isLoading.value = true
    await deleteBook(book.value.id)
    isLoading.value = false
    dialogStore.closeDialog()
}

const removeEvent = async (index: number) => {
    isLoading.value = true
    book.value.events.splice(index, 1)
    const { data, } = await patchBook(book.value.id, {
        events: book.value.events,
    })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const updateEvents = async () => {
    isLoading.value = true
    const { data, } = await patchBook(book.value.id, {
        events: book.value.events,
    })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const addNote = () => {
    if (!book.value.notes) {
        book.value.notes = []
    }
    book.value.notes.push('')
    editedNote.value = book.value.notes.length - 1
}

const editNote = (idx: number) => {
    noteValue.value = book.value.notes[idx]
    editedNote.value = idx
}

const saveNotes = async () => {
    isLoading.value = true
    if (editedNote.value > -1) {
        book.value.notes[editedNote.value] = noteValue.value
        noteValue.value = ''
    }
    editedNote.value = -1
    const notes = book.value.notes ?? []
    const { data, } = await patchBook(book.value.id, { notes, })
    book.value = BookSchema.parse(data)
    isLoading.value = false
}

const removeNote = (idx: number) => {
    book.value.notes.splice(idx, 1)
    saveNotes()
}
</script>
