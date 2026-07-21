import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
    const courseId = parseInt(params.id);

    if (isNaN(courseId)) {
        throw error(404, 'Invalid course ID');
    }

    try {
        const res = await fetch('/api/courses');
        const data = await res.json();

        if (!data.success) {
            throw error(500, 'Failed to load courses');
        }

        const course = data.courses.find(c => c.id === courseId);

        if (!course) {
            throw error(404, 'Course not found');
        }

        return {
            course,
            seoTitle: `${course.title} — BMSC ICT Club`,
            seoDescription: course.description,
            seoKeywords: `BMSC ICT Club, ${course.title}, ${course.level}, Coding, Bogura`
        };
    } catch (e) {
        if (e.status) throw e;
        throw error(500, 'Internal server error');
    }
};
