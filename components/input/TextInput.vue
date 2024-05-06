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
        <Input
            :id="id"
            v-model="inputValue"
            :type="type"
            :class="{
                'grow': true,
                'border-destructive': errorMsg
            }"
            :aria-describedby="id"
            :placeholder="placeholder"
            :name="name ? name : undefined"
            v-bind="$attrs"
            @blur="emit('blur', $event)"
            @focus="selectOnFocus && $event.target.select()"
        />
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
import InputDescription from '@/components/ui/input/InputDescription.vue'
import InputError from '@/components/ui/input/InputError.vue'
import { dateToString, } from '~/lib/utils'

const id = useId()

const emit = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
    (e: 'blur', payload: Event): void
}>()
const props = defineProps<{
    modelValue?: string | number | Date,
    label?: string,
    type?: string,
    errorMsg?: string,
    placeholder?: string,
    name?: string,
    description?: string,
    selectOnFocus?: boolean,
    required?: boolean,
}>()
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
</script>
