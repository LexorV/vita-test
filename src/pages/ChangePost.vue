<template>
  <div>
    <PostForm
      :is-edit="true"
      :initial-id="Number(route.params.id)"
      :initial-title="initial.title"
      :initial-brief-description="initial.briefDescription"
      :initial-full-description="initial.fullDescription || ''"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { PostForm } from 'src/widgets';
import { usePostStore } from 'src/stores/post-store';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const { editInitial } = storeToRefs(postStore);

const initial = editInitial.value ?? {
  id: Number(route.params.id),
  title: '',
  briefDescription: '',
  fullDescription: '',
};

if (!editInitial.value || Number(route.params.id) !== Number(editInitial.value.id)) {
  void router.replace('/');
}
</script>

<style scoped></style>
