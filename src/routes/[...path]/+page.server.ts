import { error } from '@sveltejs/kit';
import { getContent } from '$lib/utils/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
    const { path } = params;
    const content = await getContent(path);

    if (!content) {
        throw error(404, 'Not found');
    }

    const rawSlideIndex = Number.parseInt(url.searchParams.get('slide') || '0', 10);
    const requestedSlide = Number.isFinite(rawSlideIndex) ? rawSlideIndex : 0;
    const slidesLength =
        content.type === 'slides' && Array.isArray(content.data) ? content.data.length : 0;
    const initialSlideIndex =
        slidesLength > 0 ? Math.max(0, Math.min(requestedSlide, slidesLength - 1)) : 0;

    return {
        ...content,
        path,
        initialSlideIndex
    };
}
