<template>
  <q-card class="q-mb-md cursor-pointer" @click="goToPost">
    <q-card-section class="row items-center justify-between">
      <div class="col">
        <div class="text-h6">{{ post.title }}</div>
        <div class="text-caption text-grey-7">{{ brief }}</div>
      </div>
      <div class="col-auto text-caption text-grey-6">{{ post.dateTime }}</div>
    </q-card-section>
    <q-separator />
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { PostResponse } from 'src/shared/api/api';

const props = defineProps<{
  post: Pick<PostResponse, 'id' | 'title' | 'briefDescription' | 'dateTime' | 'comments'>;
}>();

const router = useRouter();
const brief = computed(() => props.post.briefDescription);

function goToPost() {
  void router.push({ path: `/post/${props.post.id}` });
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
