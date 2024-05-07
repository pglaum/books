<template>
    <div class="grid w-full gap-1.5">
        <Label
            v-if="label || $slots.default"
            :for="id"
            :class="{'text-destructive': errorMsg}"
        >
            <slot>
                {{ label }}
                <span
                    v-if="required"
                    class="font-medium text-destructive"
                >*</span>
            </slot>
        </Label>

        <Select v-model="inputValue">
            <div class="relative">
                <SelectTrigger :class="{'pr-10': allowClear && inputValue}">
                    <SelectValue :placeholder="placeholder" />
                </SelectTrigger>
                <Button
                    v-if="allowClear && inputValue"
                    variant="ghost"
                    size="icon"
                    class="absolute bottom-0 right-0"
                    @click.prevent="clear()"
                >
                    <X class="size-4" />
                </Button>
            </div>

            <SelectContent>
                <SelectGroup>
                    <SelectItem
                        v-for="option in options"
                        :key="keyKey ? option[keyKey] : option"
                        :value="valueKey ? option[valueKey] : option"
                    >
                        {{ labelKey ? option[labelKey] : option }}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

        <slot name="description">
            <InputDescription v-if="description">
                {{ description }}
            </InputDescription>
        </slot>
        <slot name="error">
            <InputError v-if="errorMsg">
                {{ errorMsg }}
            </InputError>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { X, } from 'lucide-vue-next'

import InputDescription from '@/components/ui/input/InputDescription.vue'
import InputError from '@/components/ui/input/InputError.vue'
import { dateToString, } from '~/lib/utils'

const id = useId()

const emit = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
    (e: 'blur', payload: Event): void
}>()
const props = withDefaults(defineProps<{
    modelValue?: string | number | Date | object
    options?: Array<object> | Array<string>
    label?: string
    errorMsg?: string
    placeholder?: string
    name?: string
    description?: string
    required?: boolean
    allowClear?: boolean
    keyKey?: string
    valueKey?: string
    labelKey?: string
}>(), {
    keyKey: 'value',
    valueKey: 'value',
    labelKey: 'label',
})
const { modelValue, } = toRefs(props)

const inputValue = computed({
    get () {
        if (modelValue.value instanceof Date) {
            return dateToString(modelValue.value)
        }
        return modelValue.value ?? ''
    },
    set (newValue: string | number) {
        emit('update:modelValue', newValue)
    },
})
const clear = () => {
    inputValue.value = ''
}
</script>
