import { prisma } from '$lib/server/prisma.js';

export async function GET() {
    let urls = [
        { loc: '/', changefreq: 'daily', priority: '1.0' },
        { loc: '/courses', changefreq: 'weekly', priority: '0.9' },
        { loc: '/projects', changefreq: 'weekly', priority: '0.9' },
        { loc: '/team', changefreq: 'monthly', priority: '0.8' },
        { loc: '/community', changefreq: 'weekly', priority: '0.8' },
        { loc: '/notices', changefreq: 'daily', priority: '0.8' },
        { loc: '/contact', changefreq: 'monthly', priority: '0.7' }
    ];

    try {
        const [courses, projects] = await Promise.all([
            prisma.course.findMany({ select: { slug: true, updatedAt: true } }),
            prisma.project.findMany({ select: { slug: true, updatedAt: true } })
        ]);

        courses.forEach(course => {
            urls.push({
                loc: `/courses/${course.slug}`,
                changefreq: 'monthly',
                priority: '0.8',
                lastmod: course.updatedAt.toISOString()
            });
        });

        projects.forEach(project => {
            urls.push({
                loc: `/projects/${project.slug}`,
                changefreq: 'monthly',
                priority: '0.8',
                lastmod: project.updatedAt.toISOString()
            });
        });
    } catch (e) {
        console.error('Error fetching dynamic routes for sitemap:', e);
        // Fallback to static URLs
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>https://bmscictclub.com${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}
