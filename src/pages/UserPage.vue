<template>
  <q-page padding>
    <UserCard v-if="hasCurrentUser" />
    <div v-else class="q-pa-md">Пользователь не найден</div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { UserCard } from 'src/widgets';
import { useUserStore } from 'src/stores/user-store';
import { usePostStore } from 'src/stores/post-store';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';

const route = useRoute();

const userStore = useUserStore();
const { hasCurrentUser } = storeToRefs(userStore);
const postStore = usePostStore();

async function loadUser(idParam: string | string[] | undefined) {
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id) return;

  const numericId = Number(id);

  if (!userStore.currentUser || userStore.currentUser.id !== numericId) {
    if (!postStore.isLoaded) {
      try {
        await postStore.fetchAllPosts();
      } catch {
        Notify.create({ type: 'negative', message: 'Не удалось загрузить список записей' });
      }
    }
    const user = postStore.getUserById(numericId);
    userStore.setCurrentUser(user);
  }
}

onMounted(() => {
  void loadUser(route.params.id);
});
watch(
  () => route.params.id,
  (newId) => {
    void loadUser(newId);
  },
);

onBeforeUnmount(() => {
  userStore.clearCurrentUser();
});
</script>

<style scoped></style>
