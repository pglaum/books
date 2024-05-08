<template>
    <Popover v-model:open="isOpen">
        <PopoverTrigger as-child>
            <Button
                variant="link"
                :class="cn(
                    'justify-start text-left font-normal',
                    !inputValue && 'text-muted-foreground',
                )"
            >
                <CalendarIcon class="mr-2 size-4" />
                {{ inputValue ? df.format(inputValue.toDate(getLocalTimeZone())) : "Pick a date" }}
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
            <Calendar
                v-model="inputValue"
                initial-focus
            />
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    parseDate,
} from '@internationalized/date'
import { Calendar as CalendarIcon, } from 'lucide-vue-next'

import { Button, } from '@/components/ui/button'
import { Calendar, } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover'
import { cn, } from '@/lib/utils'

const df = new DateFormatter('en-US', {
    dateStyle: 'long',
})
const isOpen = ref<boolean>(false)

const emit = defineEmits<{
    (e: 'update:modelValue', payload: string): void
}>()

const props = defineProps<{
    modelValue: string | null
}>()
const { modelValue, } = toRefs(props)

const inputValue = computed({
    get () {
        return modelValue.value ? parseDate(modelValue.value) : null
    },
    set (newValue: CalendarDate) {
        if (newValue) {
            emit('update:modelValue', newValue.toString())
        }
        isOpen.value = false
    },
})
</script>
