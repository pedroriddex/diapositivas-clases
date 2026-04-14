<script lang="ts">
    import { resolveSelectivePhase, type SlideBodyPhase } from '$lib/utils/slideTransition';

    interface ComparisonSlide {
        description?: string;
        image?: string;
        iconList?: { icon: string }[];
    }

    export let title: string;
    export let description: string;
    export let image: string = '';
    export let currentSlug: any;
    export let iconListItems: { icon: string }[] = [];
    export let bodyPhase: SlideBodyPhase = 'idle';
    export let comparisonSlide: ComparisonSlide | null = null;

    $: imageSrc = image
        ? `/media/${currentSlug}/${/\.[a-zA-Z0-9]+$/.test(image) ? image : `${image}.webp`}`
        : '';
    $: avatarPhase = resolveSelectivePhase(bodyPhase, image, comparisonSlide?.image || '');
    $: descriptionPhase = resolveSelectivePhase(bodyPhase, description, comparisonSlide?.description || '');
    $: iconListPhase = resolveSelectivePhase(bodyPhase, iconListItems, comparisonSlide?.iconList || []);
</script>

<div class="slide-about">
    <div class="slide-about__media slide-body-shell slide-body-shell--{avatarPhase}">
        {#if imageSrc}
            <img class="slide-about__avatar" src={imageSrc} alt={title}>
        {:else}
            <div class="slide-about__avatar slide-about__avatar--placeholder" aria-hidden="true"></div>
        {/if}
    </div>

    {#if title}
        <h3 class="slide-panel__title slide-about__title">{title}</h3>
    {/if}

    <div class="slide-about__copy">
        {#if description}
            <p class="slide-body slide-about__description slide-body-shell slide-body-shell--{descriptionPhase}">{description}</p>
        {/if}

        {#if iconListItems.length > 0}
            <div class="slide-about__icons slide-body-shell slide-body-shell--{iconListPhase}" aria-label="Tecnologías">
                {#each iconListItems as eachIcon}
                    <i class="{eachIcon.icon} slide-about__icon"></i>
                {/each}
            </div>
        {/if}
    </div>
</div>
