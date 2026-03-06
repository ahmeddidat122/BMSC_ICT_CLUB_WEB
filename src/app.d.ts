import { SupabaseClient, Session, User } from '@supabase/supabase-js';

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            supabase: SupabaseClient;
            safeGetSession: () => Promise<{ session: Session | null; user: User | null; dbUser: any | null }>;
            session: Session | null;
            user: User | null;
            dbUser: any | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export { };
