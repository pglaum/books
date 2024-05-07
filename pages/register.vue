<template>
    <div class="flex items-center justify-center py-24">
        <Card class="max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Register
                </CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    class="grid gap-4"
                    @submit.prevent="signUp"
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
                        Sign up
                    </Button>
                </form>
                <div class="mt-4 text-center text-sm">
                    Already have an account?
                    <NuxtLink
                        to="/login"
                        class="underline"
                    >
                        Sign in
                    </NuxtLink>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { useToast, } from '~/components/ui/toast'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toast, } = useToast()

const email = ref('')
const password = ref('')

const signUp = async () => {
    const { error, } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
    })

    if (error) {
        console.error('Error signing up:', error.message)
        toast({
            title: 'Error signing up',
            description: error.message,
            variant: 'destructive',
        })
    } else {
        toast({
            title: 'Signed up!',
            description: 'Check your email for a confirmation link.',
            variant: 'success',
        })
        router.push('/login')
    }
}

onMounted(() => {
    if (user.value) {
        router.replace('/')
    }
})

useHead({
    title: 'Register with Books',
})
</script>
