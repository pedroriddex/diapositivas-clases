import type { PageServerLoad } from './$types';
import { getHomeSections } from '$lib/utils/content';

export const load: PageServerLoad = async () => {
	return {
		homeSections: await getHomeSections()
	};
};
