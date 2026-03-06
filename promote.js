import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Fetching users...");
    const users = await prisma.user.findMany();

    if (users.length === 0) {
        console.log("No users found in the database. Please sign up on the website first.");
        return;
    }

    console.log("Found users:");
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));

    const targetUser = users[0];
    console.log(`\nPromoting ${targetUser.email} to Admin...`);

    const updatedUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: 'Admin' }
    });

    console.log(`Success! ${updatedUser.name} is now an ${updatedUser.role}.`);
    console.log("You can now refresh the dashboard page to see the Admin Console.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
