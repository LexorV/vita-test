<template>
  <q-toolbar class="bg-primary text-white">
    <q-toolbar-title>Vita Test</q-toolbar-title>
    <q-tabs dense shrink indicator-color="secondary" active-color="white">
      <q-route-tab to="/" exact label="Главная" icon="home" />
      <q-route-tab to="/users" label="Юзеры" icon="group" />
    </q-tabs>
  </q-toolbar>
</template>

<script setup lang="ts"></script>

<style scoped></style>
