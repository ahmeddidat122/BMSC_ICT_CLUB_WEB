import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Helper function to create a store synchronized with localStorage
// We only use this for Auth now to keep the user logged in across tabs.
function createPersistentStore(key, initialValue) {
    const store = writable(initialValue);
    if (browser) {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            store.set(JSON.parse(storedValue));
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
export const authStore = createPersistentStore('bmsc_ict_auth', {
    isAuthenticated: false,
    isAdmin: false,
    user: null
});

// -----------------------------------------------------------------------------
// DYNAMIC APP STORES (Populated via API / db)
// -----------------------------------------------------------------------------
// We no longer populate these with static mocked arrays.
// The pages that need them will call fetch() against our new /api/* routes
// and update these stores so the components reactively update.

export const coursesStore = writable([]);
export const noticesStore = writable([]);

// (We leave Projects and Community untouched for now as static arrays since we didn't migrate them to SQLite yet)
// -----------------------------------------------------------------------------
// PROJECTS STORE
// -----------------------------------------------------------------------------
const initialProjects = [
    {
        id: 1,
        title: 'BMSC ICT Club Website',
        description: 'Our official club website built with SvelteKit, featuring 3D animations, glassmorphism design, and interactive components.',
        image: '🌐',
        tags: ['SvelteKit', 'Tailwind CSS', 'Spline 3D'],
        contributors: ['Ahmed', 'Nusrat', 'Tanvir'],
        status: 'Live'
    },
    {
        id: 2,
        title: 'Smart Attendance System',
        description: 'An IoT-based attendance system using RFID cards and Arduino to automate student attendance tracking.',
        image: '📟',
        tags: ['Arduino', 'RFID', 'Python', 'Flask'],
        contributors: ['Imran', 'Rafiq'],
        status: 'Completed'
    },
    {
        id: 3,
        title: 'CodeQuiz App',
        description: 'A mobile quiz application for testing programming knowledge with timed challenges and leaderboards.',
        image: '📱',
        tags: ['React Native', 'Firebase', 'Node.js'],
        contributors: ['Nusrat', 'Ahmed'],
        status: 'In Progress'
    }
];
export const projectsStore = writable(initialProjects);

// -----------------------------------------------------------------------------
// COMMUNITY STORE
// -----------------------------------------------------------------------------
const initialCommunityPosts = [
    {
        id: 1,
        title: 'Best resources for learning React in 2025?',
        content: 'Hey everyone! I’m looking to dive deep into React this year. Does anyone have recommendations for completely up-to-date resources or tutorials that cover functional components and hooks well?',
        author: 'Nusrat Jahan',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat&backgroundColor=7c3aed',
        category: 'Web Development',
        timestamp: Date.now() - 7200000, // 2 hours ago
        hot: true,
        likes: 14,
        comments: [
            {
                id: 101,
                author: 'Ahmed Didat',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=0891b2',
                content: 'I highly recommend the official React docs (react.dev). They rewrote them completely recently and they are fantastic!',
                timestamp: Date.now() - 3600000 // 1 hour ago
            }
        ]
    }
];
export const communityStore = writable(initialCommunityPosts);
