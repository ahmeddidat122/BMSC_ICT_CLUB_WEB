export function generateCourseSchema(course) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "EducationalOrganization",
            "name": "BMSC ICT Club",
            "sameAs": "https://bmscictclub.com"
        },
        "url": `https://bmscictclub.com/courses/${course.slug}`,
        "image": course.imageUrl || "https://bmscictclub.com/images/club_logo.png"
    };
}
