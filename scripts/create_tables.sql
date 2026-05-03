-- Run this in Supabase Dashboard → SQL Editor
-- Tables for BMSC ICT Club Website

-- User table
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Member',
  avatar TEXT DEFAULT '',
  coverImage TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  github TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  website TEXT DEFAULT '',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  "isBanned" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Badge table
CREATE TABLE IF NOT EXISTS "Badge" (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#0ea5e9'
);

-- UserBadge table
CREATE TABLE IF NOT EXISTS "UserBadge" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "badgeId" INTEGER NOT NULL,
  "earnedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "badgeId")
);

-- AuditLog table
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id SERIAL PRIMARY KEY,
  "adminId" INTEGER NOT NULL,
  action TEXT NOT NULL,
  "targetType" TEXT,
  "targetId" INTEGER,
  details TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Course table
CREATE TABLE IF NOT EXISTS "Course" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  topics TEXT
);

-- CourseProgress table
CREATE TABLE IF NOT EXISTS "CourseProgress" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  "courseId" INTEGER NOT NULL,
  "completedTopics" TEXT,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Notice table
CREATE TABLE IF NOT EXISTS "Notice" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false
);

-- Project table
CREATE TABLE IF NOT EXISTS "Project" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  tags TEXT,
  contributors TEXT,
  status TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- TeamMember table
CREATE TABLE IF NOT EXISTS "TeamMember" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  skills TEXT,
  socials TEXT,
  "order" INTEGER DEFAULT 0
);

-- UserActivity table
CREATE TABLE IF NOT EXISTS "UserActivity" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  type TEXT NOT NULL,
  details TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Discussion table
CREATE TABLE IF NOT EXISTS "Discussion" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "authorId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- DiscussionReply table
CREATE TABLE IF NOT EXISTS "DiscussionReply" (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  "authorId" INTEGER NOT NULL,
  "discussionId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Add some default badges
INSERT INTO "Badge" (name, description, icon) VALUES
  ('Getting Started', 'Join your first event', '🚀'),
  ('Forum Starter', 'Create your first discussion', '💬'),
  ('Helpful Hand', 'Post 5 replies', '🤝'),
  ('Active Member', '10+ posts total', '⭐'),
  ('First Steps', 'Complete your first course', '📚'),
  ('Course Master', 'Complete 3 courses', '🏆')
ON CONFLICT (name) DO NOTHING;

SELECT 'Tables created successfully!' as result;