import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Helper function to create a store synchronized with localStorage
function createPersistentStore(key, initialValue) {
    // Initialize store with initialValue
    const store = writable(initialValue);

    if (browser) {
        // On client-side, check if value exists in localStorage
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            store.set(JSON.parse(storedValue));
        }

        // Subscribe to changes and save to localStorage
        store.subscribe(value => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }

    return store;
}

// -----------------------------------------------------------------------------
// AUTH STORE
// -----------------------------------------------------------------------------
export const authStore = createPersistentStore('bmsc_ict_auth', {
    isAuthenticated: false,
    isAdmin: false,
    user: null
});

// -----------------------------------------------------------------------------
// COURSES STORE
// -----------------------------------------------------------------------------
const initialCourses = [
    {
        id: 1,
        icon: '🌐',
        title: 'Web Development',
        description: 'Learn HTML, CSS, JavaScript, and modern frameworks like React and SvelteKit to build stunning websites.',
        level: 'Beginner',
        duration: '12 Weeks',
        topics: ['HTML/CSS', 'JavaScript', 'React', 'SvelteKit'],
        color: 'primary'
    },
    {
        id: 2,
        icon: '🐍',
        title: 'Python Programming',
        description: 'Master Python from basics to advanced concepts including data structures, OOP, and automation.',
        level: 'Beginner',
        duration: '10 Weeks',
        topics: ['Basics', 'OOP', 'Data Science', 'Automation'],
        color: 'secondary'
    },
    {
        id: 3,
        icon: '🎨',
        title: 'Graphic Design',
        description: 'Create stunning visuals using Figma, Photoshop, and modern design principles for the digital world.',
        level: 'Beginner',
        duration: '8 Weeks',
        topics: ['Figma', 'Photoshop', 'UI/UX', 'Branding'],
        color: 'primary'
    },
    {
        id: 4,
        icon: '🤖',
        title: 'Robotics & IoT',
        description: 'Build smart devices with Arduino, Raspberry Pi, sensors, and explore the Internet of Things.',
        level: 'Intermediate',
        duration: '14 Weeks',
        topics: ['Arduino', 'Raspberry Pi', 'Sensors', 'IoT'],
        color: 'secondary'
    },
    {
        id: 5,
        icon: '🛡️',
        title: 'Cybersecurity Basics',
        description: 'Understand networking, encryption, ethical hacking fundamentals, and online safety practices.',
        level: 'Intermediate',
        duration: '10 Weeks',
        topics: ['Networking', 'Encryption', 'Ethical Hacking', 'Security'],
        color: 'primary'
    },
    {
        id: 6,
        icon: '📱',
        title: 'App Development',
        description: 'Build cross-platform mobile apps using React Native and Flutter for Android and iOS.',
        level: 'Intermediate',
        duration: '12 Weeks',
        topics: ['React Native', 'Flutter', 'APIs', 'Publishing'],
        color: 'secondary'
    }
];
export const coursesStore = createPersistentStore('bmsc_ict_courses', initialCourses);

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
    },
    {
        id: 4,
        title: 'School Notice Board Digital',
        description: 'A digital notice board system with admin panel for real-time announcements displayed on screens around the campus.',
        image: '📺',
        tags: ['Next.js', 'MongoDB', 'Raspberry Pi'],
        contributors: ['Imran', 'Sadia'],
        status: 'In Progress'
    },
    {
        id: 5,
        title: 'Weather Station',
        description: 'A Raspberry Pi weather station that collects temperature, humidity, and pressure data and visualizes it on a web dashboard.',
        image: '🌤️',
        tags: ['Raspberry Pi', 'Python', 'Chart.js'],
        contributors: ['Imran', 'Rafiq', 'Ayesha'],
        status: 'Completed'
    },
    {
        id: 6,
        title: 'Club Management Portal',
        description: 'Internal portal for managing club members, events, finances, and communications — all in one place.',
        image: '⚙️',
        tags: ['SvelteKit', 'Supabase', 'TypeScript'],
        contributors: ['Ahmed', 'Nusrat', 'Sadia'],
        status: 'Planning'
    }
];
export const projectsStore = createPersistentStore('bmsc_ict_projects', initialProjects);

// -----------------------------------------------------------------------------
// NOTICES STORE
// -----------------------------------------------------------------------------
const initialNotices = [
    {
        id: 1,
        title: 'Annual Hackathon 2025 Registration Open',
        description: 'Register now for our biggest hackathon! Open to all students. Form teams of 3-5 members and compete for exciting prizes. Last date: March 15, 2025.',
        date: 'Feb 25, 2025',
        type: 'event',
        pinned: true
    },
    {
        id: 2,
        title: 'Web Development Course — Batch 3 Starting Soon',
        description: 'New batch of our flagship Web Development course starts on March 1st. Limited seats available. Register through the course page.',
        date: 'Feb 22, 2025',
        type: 'important',
        pinned: true
    },
    {
        id: 3,
        title: 'Monthly Meeting — March 2025',
        description: 'Monthly general body meeting scheduled for March 5th, 2025 at the school auditorium. All members are required to attend.',
        date: 'Feb 20, 2025',
        type: 'general',
        pinned: false
    },
    {
        id: 4,
        title: 'Photo & Video Contest Results',
        description: 'Results for the Digital Media contest have been published. Congratulations to all winners! Check the community page for details.',
        date: 'Feb 18, 2025',
        type: 'general',
        pinned: false
    },
    {
        id: 5,
        title: 'New Lab Equipment Arrived',
        description: 'We have received new Arduino kits, Raspberry Pi boards, and sensor modules for the Robotics & IoT lab. Sessions start next week!',
        date: 'Feb 15, 2025',
        type: 'important',
        pinned: false
    },
    {
        id: 6,
        title: 'Winter Break Project Showcase',
        description: 'Submit your winter break projects for the showcase event. Deadline: February 28th. Best projects will be featured on our website.',
        date: 'Feb 10, 2025',
        type: 'event',
        pinned: false
    }
];
export const noticesStore = createPersistentStore('bmsc_ict_notices', initialNotices);

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
    },
    {
        id: 2,
        title: 'How to get started with Arduino — Complete Beginner Guide',
        content: 'For those who attended the robotics workshop, here is a quick summary of what we covered for getting started with Arduino...',
        author: 'Imran Khan',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Imran&backgroundColor=0891b2',
        category: 'Resources & Tools',
        timestamp: Date.now() - 18000000, // 5 hours ago
        hot: false,
        likes: 8,
        comments: []
    },
    {
        id: 3,
        title: 'Hackathon team formation — Looking for designers!',
        content: 'Our team has 3 developers but we critically need someone who is good at UI/UX and Figma. Anyone interested in joining us for the Annual Hackathon?',
        author: 'Ahmed Didat',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=0891b2',
        category: 'Events & Meetups',
        timestamp: Date.now() - 86400000, // 1 day ago
        hot: true,
        likes: 5,
        comments: []
    }
];
export const communityStore = createPersistentStore('bmsc_ict_community', initialCommunityPosts);
