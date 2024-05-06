<template>
    <div class="min-h-screen">
        <div class="container sticky top-0 z-10 flex justify-between py-4 backdrop-blur-md">
            <NuxtLink
                to="/"
                class="inline-flex
                    items-center
                    gap-2
                    font-mono
                    font-medium
                    uppercase
                    text-muted-foreground"
            >
                <BookCopy class="size-6" />
                Books
            </NuxtLink>
            <div class="flex gap-4">
                <button
                    v-if="user"
                    class="underline"
                    @click="signOut"
                >
                    Sign out
                </button>
            </div>
        </div>
        <slot />
        <Toaster />
    </div>
</template>

<script setup lang="ts">
import { BookCopy, } from 'lucide-vue-next'

import { toast, } from '~/components/ui/toast'

const router = useRouter()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const signOut = async () => {
    const { error, } = await supabase.auth.signOut()
    if (error) {
        console.error('Error signing out', error.message)
        toast({
            title: 'Error signing out',
            description: error.message,
            variant: 'destructive',
        })
    } else {
        toast({
            title: 'Signed out',
            variant: 'success',
        })
        router.push('/login')
    }
}
</script>
