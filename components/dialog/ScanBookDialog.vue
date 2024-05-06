<template>
    <GDialog fullscreen>
        <template #title>
            Scan a book
        </template>
        <template #body>
            <div class="grid gap-4">
                <div class="font-medium text-destructive">
                    {{ error }}
                </div>
                <select v-model="selectedDevice">
                    <option
                        v-for="device in devices"
                        :key="device.label"
                        :value="device"
                    >
                        {{ device.label }}
                    </option>
                </select>
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
    console.log(devices.value)

    if (devices.value.length > 0) {
        selectedDevice.value = devices.value[0]
    }
})

const onDetect = (detectedCodes: Array<DetectedBarcode>) => {
    console.log('detected', detectedCodes)
    try {
        const isbn = detectedCodes[0].rawValue
        emit('scanned', isbn)
        console.log('close on detect', closeOnDetect.value)
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
</script>
