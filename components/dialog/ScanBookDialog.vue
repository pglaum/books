<template>
    <GDialog fullscreen>
        <template #title>
            Scan a book
        </template>
        <template #body>
            <div>
                hi
            </div>
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
const dialogStore = useDialogStore()
</script>
