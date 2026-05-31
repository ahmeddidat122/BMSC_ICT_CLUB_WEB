import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning existing data...');
  try {
    await prisma.project.deleteMany();
    await prisma.course.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Error during clean or table missing, continuing...');
  }

  console.log('Seeding admin user...');
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@bmsc.edu.bd',
      password: 'admin123',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      bio: 'I am the administrator of the BMSC ICT Club website.'
    }
  });

  console.log('Seeding projects...');
  await prisma.project.createMany({
    data: [
      {
        title: 'BMSC ICT Club Website',
        description: 'Our official club website built with SvelteKit, featuring 3D animations, glassmorphism design, and interactive components.',
        image: '🌐',
        tags: JSON.stringify(['SvelteKit', 'Tailwind CSS', 'Spline 3D']),
        contributors: JSON.stringify(['Ahmed', 'Nusrat', 'Tanvir']),
        status: 'Live'
      },
      {
        title: 'Smart Attendance System',
        description: 'An IoT-based attendance system using RFID cards and Arduino to automate student attendance tracking.',
        image: '📟',
        tags: JSON.stringify(['Arduino', 'RFID', 'Python', 'Flask']),
        contributors: JSON.stringify(['Imran', 'Rafiq']),
        status: 'Completed'
      },
      {
        title: 'CodeQuiz App',
        description: 'A mobile quiz application for testing programming knowledge with timed challenges and leaderboards.',
        image: '📱',
        tags: JSON.stringify(['React Native', 'Firebase', 'Node.js']),
        contributors: JSON.stringify(['Nusrat', 'Ahmed']),
        status: 'In Progress'
      }
    ]
  });

  console.log('Seeding courses...');
  await prisma.course.createMany({
    data: [
      {
        title: 'Web Development Basics',
        description: 'Master HTML, CSS, and modern JavaScript to build stunning responsive websites.',
        level: 'Beginner',
        duration: '8 Weeks',
        icon: '🌐',
        color: '#0891b2',
        topics: JSON.stringify(['HTML5 & Semantic tags', 'CSS3 & Flexbox/Grid', 'JavaScript ES6+', 'Responsive Design'])
      },
      {
        title: 'Python for Data Science',
        description: 'Learn data analysis, visualization, and machine learning using Python and popular libraries.',
        level: 'Intermediate',
        duration: '10 Weeks',
        icon: '🐍',
        color: '#eab308',
        topics: JSON.stringify(['NumPy & Pandas', 'Matplotlib & Seaborn', 'Scikit-Learn Basics', 'Data Cleaning'])
      }
    ]
  });

  console.log('Seeding notices...');
  await prisma.notice.createMany({
    data: [
      {
        title: 'New Workshop: Intro to SvelteKit',
        description: 'Join us this Saturday at 4:30 PM for a hands-on session on building modern web apps.',
        date: 'March 8, 2025',
        type: 'Workshop',
        pinned: true
      },
      {
        title: 'Project Submission Deadline',
        description: 'Final call for submitting your projects for the internal showcase competition.',
        date: 'March 15, 2025',
        type: 'Competition',
        pinned: false
      }
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
