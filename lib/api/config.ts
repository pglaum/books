import { type Config, ConfigSchema, } from "@/lib/entities/config"
import { useToast, } from "~/components/ui/toast"

export const getConfigByKey = async (key: string) => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toast, } = useToast()

    const { data, error, } = await supabase
        .from('config')
        .select()
        .eq('user_id', user.value.id)
        .eq('key', key)
        .single()

    if (error?.code === "PGRST116") {
        // no results, this is fine
        return null
    }

    if (error) {
        toast({
            title: `Error fetching key [${key}]`,
            description: error.message,
            variant: 'destructive',
        })
        return null
    } else {
        return ConfigSchema.parse(data)
    }
}

export const setConfigValue = async (config: Config) => {
    const supabase = useSupabaseClient()
    const { toast, } = useToast()

    const { data, error, } = await supabase.from('config').upsert(config).select().single()

    if (error) {
        toast({
            title: 'Error saving config',
            description: error.message,
            variant: 'destructive',
        })
    } else {
        toast({
            title: 'Config saved',
            variant: 'success',
        })
    }

    return { data, error, }
}
