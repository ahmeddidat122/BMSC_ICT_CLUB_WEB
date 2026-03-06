
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
		RouteId(): "/" | "/api" | "/api/courses" | "/api/courses/[id]" | "/api/courses/[id]/progress" | "/api/notices" | "/api/profile" | "/api/projects" | "/api/team" | "/api/users" | "/auth" | "/auth/callback" | "/community" | "/community/[id]" | "/contact" | "/courses" | "/courses/[id]" | "/dashboard" | "/login" | "/notices" | "/notices/[id]" | "/profile" | "/profile/[id]" | "/projects" | "/team";
		RouteParams(): {
			"/api/courses/[id]": { id: string };
			"/api/courses/[id]/progress": { id: string };
			"/community/[id]": { id: string };
			"/courses/[id]": { id: string };
			"/notices/[id]": { id: string };
			"/profile/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": { id?: string };
			"/api/courses": { id?: string };
			"/api/courses/[id]": { id: string };
			"/api/courses/[id]/progress": { id: string };
			"/api/notices": Record<string, never>;
			"/api/profile": Record<string, never>;
			"/api/projects": Record<string, never>;
			"/api/team": Record<string, never>;
			"/api/users": Record<string, never>;
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
			"/profile": { id?: string };
			"/profile/[id]": { id: string };
			"/projects": Record<string, never>;
			"/team": Record<string, never>
		};
		Pathname(): "/" | "/api/courses" | `/api/courses/${string}/progress` & {} | "/api/notices" | "/api/profile" | "/api/projects" | "/api/team" | "/api/users" | "/auth/callback" | "/community" | `/community/${string}` & {} | "/contact" | "/courses" | `/courses/${string}` & {} | "/dashboard" | "/login" | "/notices" | `/notices/${string}` & {} | "/profile" | `/profile/${string}` & {} | "/projects" | "/team";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/images/.gitkeep" | "/images/background.png" | "/images/circuit-bg.jpg" | "/images/club_logo.png" | "/images/futuristic-background-design_23-2148503793.avif" | string & {};
	}
}