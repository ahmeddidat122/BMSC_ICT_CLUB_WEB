
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/api" | "/api/badges" | "/api/bootstrap-admin" | "/api/contact" | "/api/courses" | "/api/courses/[id]" | "/api/courses/[id]/progress" | "/api/discussions" | "/api/discussions/[id]" | "/api/discussions/[id]/reply" | "/api/notices" | "/api/projects" | "/api/team" | "/api/users" | "/api/users/[id]" | "/api/users/[id]/achievements" | "/api/users/[id]/stats" | "/auth" | "/auth/callback" | "/community" | "/community/[id]" | "/contact" | "/courses" | "/courses/[id]" | "/dashboard" | "/login" | "/notices" | "/notices/[id]" | "/projects" | "/robots.txt" | "/sitemap.xml" | "/team";
		RouteParams(): {
			"/api/courses/[id]": { id: string };
			"/api/courses/[id]/progress": { id: string };
			"/api/discussions/[id]": { id: string };
			"/api/discussions/[id]/reply": { id: string };
			"/api/users/[id]": { id: string };
			"/api/users/[id]/achievements": { id: string };
			"/api/users/[id]/stats": { id: string };
			"/community/[id]": { id: string };
			"/courses/[id]": { id: string };
			"/notices/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/admin": Record<string, never>;
			"/api": { id?: string };
			"/api/badges": Record<string, never>;
			"/api/bootstrap-admin": Record<string, never>;
			"/api/contact": Record<string, never>;
			"/api/courses": { id?: string };
			"/api/courses/[id]": { id: string };
			"/api/courses/[id]/progress": { id: string };
			"/api/discussions": { id?: string };
			"/api/discussions/[id]": { id: string };
			"/api/discussions/[id]/reply": { id: string };
			"/api/notices": Record<string, never>;
			"/api/projects": Record<string, never>;
			"/api/team": Record<string, never>;
			"/api/users": { id?: string };
			"/api/users/[id]": { id: string };
			"/api/users/[id]/achievements": { id: string };
			"/api/users/[id]/stats": { id: string };
			"/auth": Record<string, never>;
			"/auth/callback": Record<string, never>;
			"/community": { id?: string };
			"/community/[id]": { id: string };
			"/contact": Record<string, never>;
			"/courses": { id?: string };
			"/courses/[id]": { id: string };
			"/dashboard": Record<string, never>;
			"/login": Record<string, never>;
			"/notices": { id?: string };
			"/notices/[id]": { id: string };
			"/projects": Record<string, never>;
			"/robots.txt": Record<string, never>;
			"/sitemap.xml": Record<string, never>;
			"/team": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/api/badges" | "/api/bootstrap-admin" | "/api/contact" | "/api/courses" | `/api/courses/${string}/progress` & {} | "/api/discussions" | `/api/discussions/${string}/reply` & {} | "/api/notices" | "/api/projects" | "/api/team" | "/api/users" | `/api/users/${string}/achievements` & {} | `/api/users/${string}/stats` & {} | "/auth/callback" | "/community" | `/community/${string}` & {} | "/contact" | "/courses" | `/courses/${string}` & {} | "/dashboard" | "/login" | "/notices" | `/notices/${string}` & {} | "/projects" | "/robots.txt" | "/sitemap.xml" | "/team";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/images/.gitkeep" | "/images/background.png" | "/images/background.webp" | "/images/circuit-bg.jpg" | "/images/circuit-bg.webp" | "/images/club_logo.png" | "/images/futuristic-background-design_23-2148503793.avif" | "/manifest.webmanifest" | string & {};
	}
}