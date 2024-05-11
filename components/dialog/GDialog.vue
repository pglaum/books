<template>
    <Dialog v-model:open="open">
        <DialogContent
            class="w-full grid-rows-[auto_minmax(0,1fr)_auto] p-0"
            :class="[
                fullscreen ? 'max-w-full' : large ? 'max-w-3xl' : 'max-w-xl',
                fullscreen ? 'h-full max-h-full sm:rounded-none' : 'h-dvh max-h-dvh md:h-fit md:max-h-[90dvh]'
            ]"
        >
            <DialogHeader class="p-6 pb-0">
                <slot name="header">
                    <DialogTitle class="flex items-center justify-between">
                        <h1 class="text-start text-2xl">
                            <slot name="title" />
                        </h1>

                        <Button
                            variant="ghost"
                            size="icon"
                            @click="open = false"
                        >
                            <X class="size-6" />
                            <span class="sr-only">Close</span>
                        </Button>
                    </DialogTitle>

                    <DialogDescription class="text-start">
                        <slot name="description" />
                    </DialogDescription>
                </slot>
            </DialogHeader>

            <div
                ref="dialog"
                class="grid h-full gap-4 overflow-y-auto px-6 py-4"
            >
                <slot name="body">
                    Hallo
                </slot>
            </div>

            <DialogFooter class="flex flex-wrap gap-4 p-6 pt-0">
                <slot name="footer">
                    <Button
                        type="button"
                        @click="emit('cancel', null); hideDialog()"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        @click="emit('confirm', null)"
                    >
                        Ok
                    </Button>
                </slot>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { X, } from 'lucide-vue-next'

const emit = defineEmits<{
    (e: 'cancel', payload: null): void,
    (e: 'confirm', payload: null): void,
    (e: 'closed', payload: null): void,
}>()
defineProps<{
    large?: boolean,
    autoFocus?: boolean
    fullscreen?: boolean,
}>()

const dialog = ref<HTMLElement>()
const open = ref(true)
const dialogStore = useDialogStore()
const { close, } = storeToRefs(dialogStore)

const hideDialog = () => {
    emit('closed', null)
    open.value = false

    setTimeout(() => {
        dialogStore.$reset()
    }, 200)
}

watch(open, (value) => {
    if (!value) {
        hideDialog()
    }
})

watch(close, (value) => {
    if (value) {
        hideDialog()
    }
})

onMounted(() => {
    open.value = true

    setTimeout(() => {
        let input = dialog.value?.querySelector('input:first-of-type')
        if (input == null) {
            input = dialog.value?.querySelector('textarea:first-of-type')
        }
        if (input != null) {
            input.focus()
        }
    }, 300)
})

onBeforeUnmount(() => {
    hideDialog()
})
</script>
