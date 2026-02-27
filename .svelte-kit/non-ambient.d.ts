
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
		RouteId(): "/" | "/admin" | "/community" | "/community/[id]" | "/contact" | "/courses" | "/dashboard" | "/login" | "/notices" | "/profile" | "/profile/[id]" | "/projects" | "/team";
		RouteParams(): {
			"/community/[id]": { id: string };
			"/profile/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/admin": Record<string, never>;
			"/community": { id?: string };
			"/community/[id]": { id: string };
			"/contact": Record<string, never>;
			"/courses": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/login": Record<string, never>;
			"/notices": Record<string, never>;
			"/profile": { id?: string };
			"/profile/[id]": { id: string };
			"/projects": Record<string, never>;
			"/team": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/community" | `/community/${string}` & {} | "/contact" | "/courses" | "/dashboard" | "/login" | "/notices" | "/profile" | `/profile/${string}` & {} | "/projects" | "/team";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/images/.gitkeep" | "/images/background.png" | "/images/club_logo.png" | "/images/futuristic-background-design_23-2148503793.avif" | string & {};
	}
}