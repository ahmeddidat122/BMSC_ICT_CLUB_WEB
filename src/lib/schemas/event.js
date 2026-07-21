export function generateEventSchema(event) {
    return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.title,
        "description": event.description,
        "startDate": event.startDate,
        "endDate": event.endDate,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
            "@type": "Place",
            "name": event.locationName || "BIAM Model School & College",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bogura",
                "addressCountry": "BD"
            }
        },
        "image": event.imageUrl || "https://bmscictclub.com/images/club_logo.png",
        "organizer": {
            "@type": "EducationalOrganization",
            "name": "BMSC ICT Club",
            "url": "https://bmscictclub.com"
        }
    };
}
