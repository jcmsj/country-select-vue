<template>
    <div>
        <div v-for="country in countries" class="flex gap-x-1" @click="$emit('click', country)">
            <span class="fi" :class="`fi-${country.value}`"></span>
            <span>{{  country.label}}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Country } from '../Country';

defineProps<{
    countries: Country[]
}>()
defineEmits<{
    'click':[country:Country],
}>()
</script>
