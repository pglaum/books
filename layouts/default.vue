<template>
    <div class="flex min-h-screen flex-col">
        <div class="container sticky top-0 z-10 flex items-center justify-between py-4 backdrop-blur-md">
            <NuxtLink
                to="/"
                class="inline-flex
                    items-center
                    gap-2
                    font-mono
                    font-medium
                    uppercase
                    text-muted-foreground
                    transition-colors
                    hover:text-foreground"
            >
                <img
                    src="/favicon.svg"
                    class="size-6"
                >
                Books
            </NuxtLink>
            <div class="flex gap-4">
                <Avatar v-if="user" />
            </div>
        </div>
        <slot />
        <Toaster />

        <div class="container mt-auto py-4 text-center">
            &copy; {{ new Date().getFullYear() }}
            <NuxtLink
                href="https://pglaum.de"
                class="underline underline-offset-4 hover:no-underline"
            >
                Philipp Glaum
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">

const user = useSupabaseUser()
</script>
