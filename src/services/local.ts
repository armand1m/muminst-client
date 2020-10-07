export const storage = {
    set: (key: string, data: any) =>
        localStorage.setItem(key, JSON.stringify(data)),
    get: (key: string) => {
        const item = localStorage.getItem(key)
        if (!item) {
            return
        }
        return JSON.parse(item)
    },
    remove: (key: string) => localStorage.removeItem(key),
}
