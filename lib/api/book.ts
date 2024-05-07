import { type Book, type BookList, BookSchema, } from "@/lib/entities/book"
import { useToast, } from "~/components/ui/toast"

export const insertBook = async (book: Book) => {
    const supabase = useSupabaseClient()
    const { toast, } = useToast()

    delete book.events
    const { data, error, } = await supabase.from('book').insert(book).select().single()

    if (error) {
        toast({
            title: 'Error saving book',
            description: error.message,
            variant: 'destructive',
        })
    } else {
        toast({
            title: 'Book saved',
            variant: 'success',
        })
    }

    return { data, error, }
}

export const updateBook = async (book: Book) => {
    const supabase = useSupabaseClient()
    const { toast, } = useToast()

    const { data, error, } = await supabase.from('book').upsert(book).select().single()

    if (error) {
        toast({
            title: 'Error saving book',
            description: error.message,
            variant: 'destructive',
        })
    } else {
        toast({
            title: 'Book saved',
            variant: 'success',
        })
    }

    return { data, error, }
}

export const patchBook = async (id: string, values: object) => {
    const supabase = useSupabaseClient()
    const { toast, } = useToast()

    const { data, error, } = await supabase.from('book').update(values).eq('id', id).select().single()

    if (error) {
        toast({
            title: 'Error saving book',
            description: error.message,
            variant: 'destructive',
        })
    } else {
        toast({
            title: 'Updated book',
            variant: 'success',
        })
    }

    return { data, error, }
}

export const getBook = async (id: string) => {
    const supabase = useSupabaseClient()
    const { toast, } = useToast()

    const { data, error, } = await supabase.from('book').select().eq('id', id).single()

    if (error) {
        toast({
            title: `Error fetching book [${id}]`,
            description: error.message,
            variant: 'destructive',
        })
        return null
    } else {
        return BookSchema.parse(data)
    }
}

export const findBook = async (googleBookId: string) => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toast, } = useToast()

    const { data, error, } = await supabase
        .from('book')
        .select()
        .eq('google_book_id', googleBookId)
        .eq('user_id', user.value.id)
        .single()

    if (error?.code === "PGRST116") {
        // no results, this is fine
        return null
    }

    if (error) {
        toast({
            title: `Error fetching book [${googleBookId}]`,
            description: error.message,
            variant: 'destructive',
        })
        return null
    } else {
        return BookSchema.parse(data)
    }
}

export const getBooks = async (list: BookList) => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toast, } = useToast()

    const { data, error, } = await supabase
        .from('book')
        .select()
        .eq('user_id', user.value.id)
        .eq('list', list)
        .order('updated_at', { ascending: false, })
        .limit(5)

    if (error) {
        toast({
            title: 'Error fetching books',
            description: error.message,
            variant: 'destructive',
        })
        return []
    } else {
        return data.map((value) => BookSchema.parse(value))
    }
}

export const deleteBook = async (id: string) => {
    const router = useRouter()
    const supabase = useSupabaseClient()
    const { toast, } = useToast()

    const { error, } = await supabase.from('book').delete().eq('id', id)

    if (error) {
        toast({
            title: `Error deleting book [${id}]`,
            description: error.message,
            variant: 'destructive',
        })
    } else {
        //router.push('/books')
    }
}
