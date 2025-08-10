<template>
  <div class="page-spacer">
    <PostForm :is-edit="false" />
  </div>
</template>

<script setup lang="ts">
import { PostForm } from 'src/widgets';
</script>

<style scoped>
.page-spacer {
  margin-top: 24px;
}
</style>
