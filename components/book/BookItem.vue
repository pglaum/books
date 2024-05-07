<template>
    <div
        class="relative grid cursor-pointer gap-1 rounded p-2 transition-colors hover:bg-muted/50"
        @click="dialogStore.showDialog('stored-book', book)"
    >
        <CheckCircle
            v-if="book.is_read"
            class="absolute right-4 top-4 size-4 text-success"
        />

        <div class="mx-auto aspect-[3/4] w-1/2">
            <img
                v-if="vi.imageLinks?.thumbnail"
                :src="vi.imageLinks.thumbnail"
                class="size-full object-contain"
            >
            <div
                v-else
                class="flex items-center justify-center bg-muted"
            >
                <ImageOff class="size-8 text-muted-foreground" />
            </div>
        </div>

        <div class="text-center font-semibold rfs:text-xl">
            {{ vi.title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { CheckCircle, ImageOff, } from 'lucide-vue-next'

import { type Book, } from '~/lib/entities/book'

const props = defineProps<{
    book: Book
}>()
const { book, } = toRefs(props)

const dialogStore = useDialogStore()
const vi = computed(() => book.value.google_book_data.volumeInfo)
</script>
