<template>
    <div id="app">
        <SongAudio></SongAudio>
        <router-view></router-view>
    </div>
</template>

<script>
import SongAudio from './pages/SongAudio';

export default {
    name: 'App',

    components: {
        SongAudio,
    },
}
</script>

<style>
</style>
