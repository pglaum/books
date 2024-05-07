<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
useSeoMeta({
    title: 'Books',
    ogTitle: 'Books',
    description: 'Track your books',
    ogDescription: 'Track your books',
    ogImage: '/favicon.svg',
    twitterCard: 'summary_large_image',
})
</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(.1rem);
}
</style>
