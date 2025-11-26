import { error } from '@sveltejs/kit';
import { getContent } from '$lib/utils/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
    const { path } = params;
    const content = getContent(path);

    if (!content) {
        throw error(404, 'Not found');
    }

    return {
        ...content,
        path
    };
}
