<template>
    <DropdownMenu>
        <DropdownMenuTrigger
            as="div"
            class="flex
                cursor-pointer
                items-center
                gap-2
                rounded
                px-2
                py-1
                text-muted-foreground
                transition-colors
                hover:bg-muted/50"
        >
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <UserRound class="size-5" />
            </div>
            <div>
                {{ user?.email }}
            </div>
            <ChevronDown class="size-6 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
            <DropdownMenuItem
                class="flex gap-2"
                @click="navigateTo('/inventory-mode')"
            >
                <Stamp class="size-4" />
                Inventory mode
            </DropdownMenuItem>
            <DropdownMenuItem
                class="flex gap-2"
                @click="navigateTo('/statistics')"
            >
                <AreaChartIcon class="size-4" />
                Statistics
            </DropdownMenuItem>
            <DropdownMenuItem
                class="flex gap-2"
                @click="signOut"
            >
                <LogOut class="size-4" />
                Sign out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
import { AreaChartIcon, ChevronDown,
         LogOut,
         Stamp,
         UserRound, } from 'lucide-vue-next'

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
