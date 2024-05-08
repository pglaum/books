<template>
    <GDialog fullscreen>
        <template #title>
            Scan a book
        </template>
        <template #body>
            <Scanner @scanned="isScanned" />
        </template>
        <template #footer>
            <Button
                variant="outline"
                @click="dialogStore.closeDialog()"
            >
                Cancel
            </Button>
        </template>
    </GDialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: 'scanned', payload: string): void
}>()

const props = withDefaults(defineProps<{
    closeOnDetect?: boolean
}>(), {
    closeOnDetect: true,
})
const { closeOnDetect, } = toRefs(props)

const dialogStore = useDialogStore()

const isScanned = (isbn: string) => {
    emit('scanned', isbn)
    if (closeOnDetect) {
        dialogStore.closeDialog()
    }
}
</script>
