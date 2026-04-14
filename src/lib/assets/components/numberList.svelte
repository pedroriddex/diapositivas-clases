<script lang="ts">
    export let numberListItems;
</script>

<ul class="slide-number-list">
    {#each numberListItems as eachItem}
        <li class="slide-number-list__item">
            <span class="slide-number-list__number">{eachItem.num}</span>
            <div class="slide-number-list__body">
                <span class="slide-number-list__title">{eachItem.title}</span>
                {#if eachItem.description}
                    <span class="slide-number-list__description">{eachItem.description}</span>
                {/if}
            </div>
        </li>
    {/each}
</ul>
