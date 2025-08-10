<template>
  <q-page class="row items-center justify-evenly"> </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { api } from 'src/boot/axios';

onMounted(async () => {
  const response = await api.get('/userInfo/findAll');
  console.log(response.data);
});
</script>
