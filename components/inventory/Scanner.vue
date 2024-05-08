<template>
    <div class="grid gap-4">
        <div
            v-if="error"
            class="font-medium text-destructive"
        >
            {{ error }}
        </div>
        <SelectInput
            v-model="selectedDevice"
            :options="devices"
            key-key="label"
            :value-key="null"
            label-key="label"
            @update:model-value="updateCookie()"
        />
        <ClientOnly>
            <QrcodeStream
                v-if="selectedDevice !== null"
                :constraints="{deviceId: selectedDevice.deviceId}"
                :formats="['ean_13']"
                @error="onError"
                @detect="onDetect"
            />
            <div
                v-else
                class="font-medium text-destructive"
            >
                No cameras on this device!
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { QrcodeStream, } from 'vue-qrcode-reader'

import { useToast, } from '@/components/ui/toast'
import type { DetectedBarcode, } from '~/lib/entities/barcode'

const emit = defineEmits<{
    (e: 'scanned', payload: string): void
}>()

const props = defineProps<{
    closeOnDetect?: boolean
}>()
const { closeOnDetect, } = toRefs(props)

const dialogStore = useDialogStore()
const { toast, } = useToast()

const error = ref('')
const devices = ref<MediaDeviceInfo[]>([])
const selectedDevice = ref<MediaDeviceInfo|null>(null)

onMounted(async () => {
    devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
        ({ kind, }) => kind === 'videoinput'
    )

    if (devices.value.length > 0) {
        const selectedCamera = useCookie('selected-camera').value
        if (selectedCamera) {
            selectedDevice.value = devices.value.find((device) => device.label === selectedCamera) ?? null
        }
        if (!selectedDevice.value) {
            selectedDevice.value = devices.value[0]
        }
    }
})

const onDetect = (detectedCodes: Array<DetectedBarcode>) => {
    try {
        const isbn = detectedCodes[0].rawValue
        emit('scanned', isbn)
        if (closeOnDetect.value) {
            dialogStore.closeDialog()
        }
    } catch (err) {
        console.error(err)
        toast({
            description: err instanceof Error ? err.message : 'Exception in onDetect',
            variant: 'destructive',
        })
    }
}

const onError = (err: Error): void => {
    error.value = `[${err.name}]: `

    if (err.name === 'NotAllowedError') {
        error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
        error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
        error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
        error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
        error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
        error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
        error.value +=
            'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
        error.value += err.message
    }
}

const updateCookie = () => {
    useCookie('selected-camera').value = selectedDevice.value?.label ?? null
}
</script>
