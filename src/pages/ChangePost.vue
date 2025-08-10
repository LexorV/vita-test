<template>
  <div>
    <PostForm
      :is-edit="true"
      :initial-id="Number(route.params.id)"
      :initial-title="(route.query.title as string) || ''"
      :initial-brief-description="(route.query.brief as string) || ''"
      :initial-full-description="(route.query.full as string) || ''"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { PostForm } from 'src/widgets';

const route = useRoute();
</script>

<style scoped></style>
