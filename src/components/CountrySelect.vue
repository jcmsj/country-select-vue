<template>
    <div @focusin="focus" @focusout="unfocus" ref="root">
        <span class="flex gap-x-1">
            <span class="fi flex" :class="`fi-${selected?.value}`"></span>
            <input type="text" v-model="query">
        </span>
        <CountryList @click="c => {selected=c;focusedInput = false}" class="country-list h-[40vh] w-max overflow-auto" :countries="filtered" :class="{'hidden':!focusedInput}"></CountryList>
    </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref, watch, watchEffect } from 'vue';
import { Country } from '../Country';
import { Trie, trie } from '../trie';
import CountryList from './CountryList.vue';
const root = ref<HTMLElement>()
function unfocus(e:Event) {
    let queue = [...root.value?.childNodes ??[]]
    while (queue.length) {
        const node = queue.pop() 
        if (node?.isSameNode(e.explicitOriginalTarget)) {
            return
        }
        queue.push(...node?.childNodes ??[])
    }

    focusedInput.value = false
}

function focus() {
    focusedInput.value = true
}

const focusedInput = ref(false)
const searcher = ref<Trie<Country>>(trie({label:'', value: ''}, true) as Trie<Country>)
const query = ref("")
const selected = ref<Country>()
watchEffect(() => {
    if (query.value == '') {
        selected.value = undefined
    }
})
watch(() => selected.value, s => {
    if (s) {
        query.value = s?.label
    }
})
const countries = ref<Country[]>([])
const filtered = computed<Country[]>(() => {
    if (query.value == '') {
        return countries.value
    } else {
        return searcher.value.searchPartial(query.value).map(n => n.value)
    }
})


watchEffect(() => {
    console.log(query)
})

onBeforeMount(async() => {
    const values:Country[] = await (await fetch("/counties.json")).json()
    countries.value = values
    const root = trie({label:'', value:''}, true)
    for (const c of values) {
        root.insert(c.label, c) 
    }
    searcher.value = root
})
</script>
