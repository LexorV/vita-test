<template>
  <q-item>
    <q-item-section>
      <div class="row items-center justify-between q-mb-xs">
        <div class="col">
          <div class="text-subtitle2">{{ comment.userInfo }}</div>
          <div class="text-caption text-grey-7">{{ comment.email }}</div>
        </div>
        <div class="col-auto row items-center q-gutter-xs">
          <div class="text-caption text-grey-6">{{ comment.dateTime }}</div>
          <q-btn
            flat
            round
            dense
            icon="delete_outline"
            color="negative"
            @click="onDelete"
            aria-label="Удалить комментарий"
          />
        </div>
      </div>
      <div class="text-body2">{{ comment.textComment }}</div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { PostComment } from 'src/shared/api/api';

const props = defineProps<{ comment: PostComment }>();
const emit = defineEmits<{ (e: 'delete', id: number): void }>();

function onDelete() {
  emit('delete', props.comment.id);
}
</script>

<style scoped>
.text-body2 {
  white-space: pre-line;
}
</style>
