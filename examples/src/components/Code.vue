<template>
    <div v-if="truncate && size > truncate">Result size is {{ prettySize }}. Truncated to the first {{ prettyLimit }}.
    </div>
    <pre v-highlightjs="truncatedValue"><code class="graphql"></code></pre>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, computed } from 'vue'
import prettyBytes from 'pretty-bytes'

import darkCss from 'vue3-highlightjs/styles/dark.css?raw'
import lightCss from 'vue3-highlightjs/styles/default.css?raw'

import { useQuasar } from 'quasar'
const props = defineProps<{ language: string, value?: string, truncate?: number }>()

const size = computed(() => props.value?.length ?? 0)
const prettySize = computed(() => prettyBytes(size.value))
const prettyLimit = computed(() => prettyBytes(props.truncate ?? 0))
const truncatedValue = computed(() => props.value?.substring(0, props.truncate))

const id = "hl-style"
const $q = useQuasar()

onMounted(() => {
    let styleTag = document.getElementById(id)
    if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.id = id
        document.head.appendChild(styleTag)
    }
    styleTag!.innerHTML = $q.dark.isActive ? darkCss : lightCss
})
onUnmounted(() => {
    document.getElementById(id)?.remove()


})
</script>