<script lang="ts">
    export let normalListItems;
</script>

<ul class="slide-normal-list">
    {#each normalListItems as eachItem}
        <li class="slide-normal-list__item">
            <div class="slide-normal-list__row">
                <span class="slide-normal-list__bullet"></span>
                <span class="slide-normal-list__title">{eachItem.title}</span>
            </div>
            {#if eachItem.description}
                <span class="slide-normal-list__description">{eachItem.description}</span>
            {/if}
        </li>
    {/each}
</ul>
