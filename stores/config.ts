import { getConfigByKey, setConfigValue, } from "~/lib/api/config"
import { ConfigKeyEnum, ConfigSchema, } from "~/lib/entities/config"

export const useConfigStore = defineStore('config', {
    state () {
        return {
            wishlist: {},
            wishlistOrder: [],
        }
    },
    actions: {
        async getWishlistOrder (fetch: boolean = false) {
            if (!fetch && this.wishlistOrder && this.wishlistOrder.length > 0) {
                return this.wishlistOrder
            }

            this.wishlist = await getConfigByKey(ConfigKeyEnum.Values.WISHLIST_ORDER)
            this.wishlistOrder = this.wishlist?.data ?? []
            return this.wishlistOrder
        },
        async setWishlistOrder (order: Array<string>) {
            if (this.wishlist && Object.keys(this.wishlist).length) {
                this.wishlist.data = order
            } else {
                this.wishlist = {
                    key: ConfigKeyEnum.Values.WISHLIST_ORDER,
                    data: order,
                }
            }
            const { data, } = await setConfigValue(this.wishlist)
            this.wishlist = ConfigSchema.parse(data)
            this.wishlistOrder = this.wishlist?.data ?? []
        },
    },
})

