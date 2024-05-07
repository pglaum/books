<template>
    <div class="flex items-center justify-center py-24">
        <Card class="max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Login
                </CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    class="grid gap-4"
                    @submit.prevent="signIn"
                >
                    <TextInput
                        v-model="email"
                        type="email"
                        label="Email"
                    />
                    <TextInput
                        v-model="password"
                        type="password"
                        label="Password"
                    />
                    <Button
                        type="submit"
                        class="w-full"
                    >
                        Login
                    </Button>
                </form>
                <div class="mt-4 text-center text-sm">
                    Don't have an account?
                    <NuxtLink
                        to="/register"
                        class="underline"
                    >
                        Sign up
                    </NuxtLink>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useToast, } from '~/components/ui/toast'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toast, } = useToast()

const email = ref('')
const password = ref('')

const signIn = async () => {
    const { error, } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    if (error) {
        console.error('Error signing in', error.message)
        toast({
            title: 'Error signing in',
            description: error.message,
            variant: 'destructive',
        })
    } else {
        toast({
            title: 'Logged in',
            variant: 'success',
        })
    }
}

watchEffect(() => {
    if (user.value) {
        navigateTo('/confirm')
    }
})

useHead({
    title: 'Login to Books',
})
</script>
