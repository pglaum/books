<template>
    <div class="container my-24 grid max-w-3xl gap-8">
        <div class="flex flex-wrap items-end gap-4">
            <H1>Statistics</H1>
        </div>

        <AreaChart
            :data="perMonth"
            index="name"
            :categories="['bought', 'read']"
        />

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Bought</TableHead>
                    <TableHead>Read</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow
                    v-for="month, index in perMonth.toReversed()"
                    :key="index"
                >
                    <TableCell>{{ month.name }}</TableCell>
                    <TableCell>{{ month.bought }}</TableCell>
                    <TableCell>{{ month.read }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<script setup lang="ts">
import { CalendarDate,
         DateFormatter,
         endOfMonth,
         getLocalTimeZone,
         parseDate,
         startOfMonth,
         today, } from '@internationalized/date'

import { getBooks, } from '~/lib/api/book'
import { type Book, type BookEventType, BookEventTypeEnum,    } from '~/lib/entities/book'

const isLoading = ref<boolean>(true)
const books = ref<Book[]>([])

const loadBooks = async () => {
    isLoading.value = true
    books.value = await getBooks(undefined, 0)
    isLoading.value = false
}

const monthFormatter = new DateFormatter('en-US', {
    month: 'short',
    year: '2-digit',
})

const getCount = (start: CalendarDate, type: BookEventType) => {
    const end = endOfMonth(start)
    const res = books.value.filter((book) => {
        const boughtDate = book.events?.find((event) => event.event === type)
        if (boughtDate && boughtDate.date) {
            const date = parseDate(boughtDate.date)
            return date >= start && date <= end
        }
        return false
    })
    return res.length
}

const perMonth = computed(() => {
    const data = []
    const end = startOfMonth(today(getLocalTimeZone()))
    let start = startOfMonth(today(getLocalTimeZone())).subtract({ years: 1, })
    while (start < end) {
        start = start.add({ months: 1, })
        data.push({
            name: monthFormatter.format(start.toDate(getLocalTimeZone())),
            bought: getCount(start, BookEventTypeEnum.Values.BOUGHT),
            read: getCount(start, BookEventTypeEnum.Values.READ),
        })
    }
    return data
})

onMounted(() => {
    loadBooks()
})

useHead({
    title: 'Statistics',
})
</script>
