<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <HeaderBlock />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { HeaderBlock } from 'src/widgets';
</script>
