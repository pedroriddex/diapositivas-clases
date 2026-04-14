import { env } from '$env/dynamic/public';

export type SiteVariant = 'web' | 'wordpress';

export interface HomeSection {
	title: string;
	color: 'red' | 'blue' | 'yellow' | 'black';
	icon: string;
	href: string;
}

export interface SiteConfig {
	variant: SiteVariant;
	title: string;
	badge: string;
	subtitle: string;
	instructor: string;
	homeSections: HomeSection[];
}

const siteConfigs: Record<SiteVariant, SiteConfig> = {
	web: {
		variant: 'web',
		title: 'Súper diapositivas | Desarrollo web',
		badge: 'Desarrollo web',
		subtitle: '¿Dónde vamos hoy?',
		instructor: 'Pedro José Reyes Rodríguez',
		homeSections: [
			{
				title: 'Introducción',
				color: 'black',
				icon: 'ri-emotion-laugh-fill',
				href: 'intro'
			},
			{
				title: 'Temarios',
				color: 'black',
				icon: 'ri-bookmark-fill',
				href: 'theme'
			},
			{
				title: 'Ejercicios',
				color: 'black',
				icon: 'ri-apps-2-fill',
				href: 'ejercicios'
			},
			{
				title: 'Enlaces importantes',
				color: 'black',
				icon: 'ri-link',
				href: 'enlaces'
			}
		]
	},
	wordpress: {
		variant: 'wordpress',
		title: 'Súper diapositivas | WordPress',
		badge: 'WordPress',
		subtitle: '¿Qué bloque veremos hoy?',
		instructor: 'Pedro José Reyes Rodríguez',
		homeSections: [
			{
				title: 'Presentación',
				color: 'black',
				icon: 'ri-emotion-laugh-fill',
				href: 'intro'
			},
			{
				title: 'Temario',
				color: 'black',
				icon: 'ri-bookmark-fill',
				href: 'theme'
			},
			{
				title: 'Ejercicios',
				color: 'black',
				icon: 'ri-apps-2-fill',
				href: 'ejercicios'
			},
			{
				title: 'Enlaces importantes',
				color: 'black',
				icon: 'ri-link',
				href: 'enlaces'
			}
		]
	}
};

function resolveVariant(value: string | undefined): SiteVariant {
	return value === 'wordpress' ? 'wordpress' : 'web';
}

export const siteVariant = resolveVariant(env.PUBLIC_SITE_VARIANT);
export const siteConfig = siteConfigs[siteVariant];
