export class LocalStorage {

    static isClientSide() {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }
    static setItem(key: string, value: string | object) {
        if (LocalStorage.isClientSide()) {
            if (typeof value !== 'string') {
                localStorage.setItem(key, JSON.stringify(value))
            } else {
                localStorage.setItem(key, value)
            }
        }

    }

    static getItem(key: string) {
        if (LocalStorage.isClientSide()) {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    // not a json
                    return value;
                }
            }
        }
    }

    static removeItem(key: string) {
        if (LocalStorage.isClientSide()) {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
            }
        }
    }

    static clear() {
        if (LocalStorage.isClientSide()) {
            if (localStorage.length > 0) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        localStorage.removeItem(key);
                    }
                }
            }
        }
    }
}