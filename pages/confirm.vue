<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        Waiting for login...
    </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, () => {
    if (user.value) {
        useCookie(`${cookieName}-redirect-path`).value = null
        return navigateTo(redirectPath || '/')
    }
}, { immediate: true, })
</script>
