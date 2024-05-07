import { z, } from 'zod'

export const BookVolumeSchema = z.object({
    kind: z.string(),
    id: z.string(),
    etag: z.string(),
    selfLink: z.string().url(),
    volumeInfo: z.object({
        title: z.string(),
        subtitle: z.string().nullish(),
        authors: z.array(z.string()).nullish(),
        publisher: z.string().nullish(),
        publishedDate: z.string().nullish(),
        description: z.string().nullish(),
        industryIdentifiers: z.array(z.object({
            type: z.string(),
            identifier: z.string(),
        })).nullish(),
        readingModes: z.object({
            text: z.boolean(),
            image: z.boolean(),
        }),
        pageCount: z.number().nullish(),
        printedPageCount: z.number().nullish(),
        dimensions: z.object({
            height: z.string().nullish(),
            width: z.string().nullish(),
            thickness: z.string().nullish(),
        }).nullish(),
        printType: z.string(),
        categories: z.array(z.string()).nullish(),
        maturityRating: z.string(),
        allowAnonLogging: z.boolean(),
        contentVersion: z.string(),
        panelizationSummary: z.object({
            containsEpubBubbles: z.boolean(),
            containsImageBubbles: z.boolean(),
        }).nullish(),
        imageLinks: z.object({
            smallThumbnail: z.string().url(),
            thumbnail: z.string().url(),
        }).nullish(),
        language: z.string(),
        previewLink: z.string().url(),
        infoLink: z.string().url(),
        canonicalVolumeLink: z.string().url(),
    }),
    saleInfo: z.object({
        country: z.string(),
        saleability: z.string(),
        isEbook: z.boolean(),
        listPrice: z.object({
            amount: z.number(),
            currencyCode: z.string(),
        }).nullish(),
        retailPrice: z.object({
            amount: z.number(),
            currencyCode: z.string(),
        }).nullish(),
        buyLink: z.string().url().nullish(),
        offers: z.array(z.object({
            finskyOfferType: z.number().nullish(),
            listPrice: z.object({
                amountInMicros: z.number(),
                currencyCode: z.string(),
            }).nullish(),
            retailPrice: z.object({
                amountInMicros: z.number(),
                currencyCode: z.string(),
            }).nullish(),
            giftable: z.boolean().nullish(),
        })).nullish(),
    }),
    accessInfo: z.object({
        country: z.string(),
        viewability: z.string(),
        embeddable: z.boolean(),
        publicDomain: z.boolean(),
        textToSpeechPermission: z.string(),
        epub: z.object({
            isAvailable: z.boolean(),
        }),
        pdf: z.object({
            isAvailable: z.boolean(),
            acsTokenLink: z.string().nullish(),
        }),
        webReaderLink: z.string().url(),
        accessViewStatus: z.string(),
        quoteSharingAllowed: z.boolean(),
    }),
    searchInfo: z.object({
        textSnippet: z.string(),
    }).nullish(),
})

export const SearchResultSchema = z.object({
    kind: z.string(),
    totalItems: z.number(),
    items: z.array(BookVolumeSchema).nullish(),
})

export type BookVolume = z.infer<typeof BookVolumeSchema>
export type SearchResultSchema = z.infer<typeof SearchResultSchema>
