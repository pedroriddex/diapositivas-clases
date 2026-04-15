<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { resolveSelectivePhase, type SlideBodyPhase } from '$lib/utils/slideTransition';
    import { autoHeight } from '$lib/actions/autoHeight';

    interface ComparisonSlide {
        template?: string;
        description?: string;
        image?: string;
        iframe?: string;
    }

    export let title: string;
    export let description: string;
    export let icon: string;
    export let image: string;
    export let iframe: string;
    export let currentSlug: any;
    export let bodyPhase: SlideBodyPhase = 'idle';
    export let comparisonSlide: ComparisonSlide | null = null;

    $: imageSrc = image
        ? `/media/${currentSlug}/${/\.[a-zA-Z0-9]+$/.test(image) ? image : `${image}.webp`}`
        : '';
    $: descriptionPhase = resolveSelectivePhase(bodyPhase, description, comparisonSlide?.description || '');
    $: mediaPhase = resolveSelectivePhase(bodyPhase, { image, iframe }, { image: comparisonSlide?.image || '', iframe: comparisonSlide?.iframe || '' });
    $: canAnimateMediaHeight = comparisonSlide?.template === 'image';
</script>         

<div class="slide-image">
    <div class="slide-image__content">
        {#if title || icon}
            <div class="slide-heading">
                {#if icon}
                    <i in:fade={{ duration: 180 }} class="{icon} slide-heading__icon slide-heading__icon--section"></i>
                {/if}
                {#if title}
                    <h2 in:fly={{ y: 5, duration: 200 }} class="slide-section__title">{title}</h2>
                {/if}
            </div>
        {/if}

        <div class="slide-image__body">
            {#if description}
                <p class="slide-body slide-body-shell slide-body-shell--{descriptionPhase}">{description}</p>
            {/if}

            {#if image}
                <img
                    class="slide-image__media slide-body-shell slide-body-shell--{mediaPhase}"
                    src={imageSrc}
                    alt=""
                    use:autoHeight={{
                        duration: 260,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        delay: 24,
                        enabled: canAnimateMediaHeight
                    }}
                >
            {/if}

            {#if iframe}
                <iframe
                    title={title}
                    class="slide-image__media slide-body-shell slide-body-shell--{mediaPhase}"
                    src=/media/{currentSlug}/{iframe}/index.html
                    frameborder="0"
                    use:autoHeight={{
                        duration: 260,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        delay: 24,
                        enabled: canAnimateMediaHeight
                    }}
                ></iframe>
            {/if}
        </div>
    </div>
</div>
