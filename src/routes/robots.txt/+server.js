export async function GET() {
    const robots = `User-agent: *
Allow: /
Sitemap: https://bmscictclub.com/sitemap.xml`;

    return new Response(robots, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}
