/**
 * One-off script: set a user's role to Admin by email.
 * Run: npm run make-admin
 * 
 * Uses Supabase REST API to bypass connection issues
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const email = 'alannobita21@gmail.com';

async function main() {
    console.log(`Updating ${email} to Admin...`);
    
    const { data, error } = await supabase
        .from('User')
        .update({ role: 'Admin' })
        .eq('email', email)
        .select();
    
    if (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
    
    if (!data || data.length === 0) {
        console.error(`No user found with email: ${email}`);
        console.error('Tip: Login once with this email to create the account first');
        process.exit(1);
    }
    
    console.log('Success! User is now an Admin.');
    console.log('Updated:', data);
}

main()
    .catch((e) => {
        console.error('Error:', e.message);
        process.exit(1);
    });