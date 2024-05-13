// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        pageTransition: {
            name: 'page',
            mode: 'out-in',
        },
        head: {
            link: [
                {
                    rel: 'icon',
                    href: '/favicon.svg',
                },
            ],
        },
    },
    build: {
        postcss: {
            plugins: [
                require('rfs'),
            ],
        },
    },
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
    devServer: {
        "host": "0.0.0.0",
    },
    experimental: {
        payloadExtraction: false,
    },
    modules: [
        '@nuxtjs/supabase',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        'shadcn-nuxt',
    ],
    pinia: {
        storesDirs: [ './stores/**', ],
    },
    runtimeConfig: {
        public: {
            googleApiKey: '',
            schema: 'public',
        },
    },
    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },
    supabase: {
        clientOptions: {
            db: {
                schema: process.env.NUXT_PUBLIC_SCHEMA ?? 'books',
            },
        },
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: [
                '/login',
                '/register',
                '/forgot-password',
                '/reset-password',
            ],
            cookieRedirect: true,
        },
    },
})
