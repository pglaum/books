<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        <div class="flex gap-4">
            <Button
                @click="dialogStore.showDialog('scan-book')"
            >
                <Barcode class="size-4" />
                Scan a book
            </Button>
        </div>

        <div class="h-screen bg-blue-50" />
        <div class="h-screen bg-success" />

        <ScanBookDialog
            v-if="scanBookDialogVisible"
            close-on-detect
            @scanned="(e) => router.push(`/search?q=isbn:${e}`)"
        />
    </div>
</template>

<script setup lang="ts">
import { Barcode, } from 'lucide-vue-next'

const router = useRouter()
const dialogStore = useDialogStore()
const scanBookDialogVisible = dialogStore.isVisibleComputed('scan-book')

useHead({
    title: 'Books',
})
</script>
