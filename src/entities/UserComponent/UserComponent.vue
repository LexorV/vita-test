<template>
  <q-card class="user-card q-pa-md q-mb-md" @click="goToUser">
    <div class="row items-center justify-between">
      <div class="col">
        <div class="text-h6">{{ user.fullName }}</div>
        <div class="text-subtitle2 text-grey-7">@{{ user.blogName }}</div>
      </div>
      <div class="col-auto">
        <q-btn color="negative" icon="delete" flat dense @click.stop="onDelete" />
      </div>
    </div>
    <div class="q-mt-sm text-caption text-grey-6">Постов: {{ user.post?.length ?? 0 }}</div>
  </q-card>
  <q-separator spaced />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user-store';
import { api } from 'src/boot/axios';
import type { User } from 'src/types/types';

const emit = defineEmits<{
  (e: 'deleted', id: number): void;
}>();

const props = defineProps<{
  user: User;
}>();

const user = computed(() => props.user);

async function onDelete() {
  try {
    await api.delete(`/userInfo/${user.value.id}`);
    emit('deleted', user.value.id);
  } catch (err) {
    // В реальном приложении: нотификация об ошибке
    console.error('Не удалось удалить пользователя', err);
  }
}

const router = useRouter();
function goToUser() {
  const store = useUserStore();
  store.setCurrentUser(user.value);
  void router.push({ path: `/user/${user.value.id}` });
}
</script>

<style scoped>
.user-card {
  width: 100%;
}
</style>
