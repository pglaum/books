<script setup lang="ts">
import { useTextareaAutosize, useVModel, } from '@vueuse/core'
import type { HTMLAttributes, } from 'vue'

import { cn, } from '@/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
    defaultValue?: string | number
    modelValue?: string | number
    autoResize?: boolean
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
})

const { textarea, input, } = useTextareaAutosize({})
watch(input, () => {
    modelValue.value = input.value
})

onMounted(() => {
    input.value = modelValue.value
})
</script>

<template>
    <textarea
        ref="textarea"
        v-model="input"
        :class="cn('flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    />
</template>
