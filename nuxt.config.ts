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
                    type: 'image/png',
                    href: '/gyrnal_logo.png',
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
        },
    },
    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },
    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/login',
            exclude: [
                '/login',
                '/register',
                '/forgot-password',
                '/reset-password',
            ],
        },
    },
})
