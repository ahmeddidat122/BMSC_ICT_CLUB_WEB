import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Helper function to create a store synchronized with localStorage
function createPersistentStore(key, initialValue) {
    const store = writable(initialValue);
    if (browser) {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            try {
                store.set(JSON.parse(storedValue));
            } catch (e) {
                console.error(`Error parsing stored value for ${key}:`, e);
            }
        }
        store.subscribe(value => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }
    return store;
}

// -----------------------------------------------------------------------------
// AUTH STORE (Persists Session in LocalStorage)
// -----------------------------------------------------------------------------
const baseAuthStore = createPersistentStore('bmsc_ict_auth', {
    isAuthenticated: false,
    isAdmin: false,
    user: null
});

export const authStore = {
    subscribe: baseAuthStore.subscribe,
    set: baseAuthStore.set,
    update: baseAuthStore.update,
    signOut() {
        baseAuthStore.set({
            isAuthenticated: false,
            isAdmin: false,
            user: null
        });
        if (browser) {
            localStorage.removeItem('bmsc_ict_auth');
        }
    }
};

// -----------------------------------------------------------------------------
// DYNAMIC APP STORES (Populated via API / db)
// -----------------------------------------------------------------------------
export const coursesStore = writable([]);
export const noticesStore = writable([]);
export const projectsStore = writable([]);
export const communityStore = writable([]);
