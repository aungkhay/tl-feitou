<template>
    <v-app-bar :elevation="0" density="comfortable">
        <v-app-bar-nav-icon @click="switchDrawer"></v-app-bar-nav-icon>
        <v-app-bar-title class="font-weight-bold">{{ barTitle }}</v-app-bar-title>

        <template #extension>
            <div class="bg-grey-lighten-4 w-100">
                <v-tabs v-model="active" show-arrows density="compact" color="primary" bg-color="grey-lighten-4" variant="text">
                    <v-tab density="compact" v-for="t in tabs" :key="t.key" :value="t.key" @click="goTab(t)">
                        <span class="mr-2 text-caption">{{ t.title }}</span>
                        <v-btn v-if="tabs.length > 1" icon="mdi-close" variant="text" size="x-small" @click.stop="closeTab(t)"/>
                    </v-tab>
                </v-tabs>
            </div>
        </template>
    </v-app-bar>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useDrawerStore } from '../stores/drawer';
import { useTabsStore } from '../stores/tabs';
import { useRouter } from 'vue-router';

const drawerStore = useDrawerStore();
const tabsStore = useTabsStore();
const barTitle = computed(() => drawerStore.barTitle);
const tabs = computed(() => tabsStore.tabs);
const active = computed({
    get: () => tabsStore.activeKey,
    set: (key) => tabsStore.setActive(key),
});
const router = useRouter();

function switchDrawer() {
    drawerStore.setDrawer();
}

function goTab(t) {
    tabsStore.setActive(t.key);
    router.push({ name: t.key });
}

function closeTab(tab) {
    const nextPath = tabsStore.close(tab.key);
    if (nextPath) router.push(nextPath);
}
</script>