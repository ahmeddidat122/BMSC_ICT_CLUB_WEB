export async function GET() {
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api
Disallow: /auth
Disallow: /login
Crawl-delay: 1

Sitemap: https://bmscictclub.com/sitemap.xml`;

    return new Response(robots, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}
