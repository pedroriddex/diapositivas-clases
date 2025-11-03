<script lang="ts">
    export let title: string;
    export let description: string;
    export let icon: string;
    export let download: boolean = false;
    export let downloadLink: string = '';

    import { fade, fly } from 'svelte/transition';
    import Icon from '$lib/assets/components/icon.svelte';

</script>

    <div class="animate-fade-in animate-duration-200 animation-delay-500 flex flex-col items-center justify-center gap-10 p-5 rounded-xl max-w-[700px] w-full">
        <div class="flex flex-col gap-3 w-full">
            {#key title}
            <div in:fly="{{ y: 5, duration: 200 }}" class="flex items-center justify-start gap-3 mb-6">
                <Icon icon={icon} color="red" size="large" />
                <h2 class="text-3xl font-regular max-sm:text-4xl text-red-600">{title}</h2>
            </div>
            {/key}
            {#key description}
                <p in:fade="{{ duration: 200, delay: 200 }}" class="font-regular text-md text-zinc-950">{description}</p>
            {/key}
            {#if download}
                <a href={downloadLink} download class="animate-fade-in animate-delay-600 flex items-center justify-center gap-3 mt-10 self-start
                hover:opacity-50 transition-all">
                    <Icon icon="ri-download-line" color="black" size="medium" />
                    Descargar proyecto de ejemplo
                </a>
            {/if}
        </div>
    </div>