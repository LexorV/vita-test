<template>
  <q-page padding>
    <UserCard v-if="hasCurrentUser" />
  </q-page>
  <div v-if="!hasCurrentUser" class="q-pa-md">Пользователь не найден</div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserCard } from 'src/widgets';
import { useUserStore } from 'src/stores/user-store';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const { hasCurrentUser } = storeToRefs(userStore);

function loadUser(idParam: string | string[] | undefined) {
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id) {
    void router.replace('/');
    return;
  }
  if (!userStore.hasCurrentUser || String(userStore.currentUser?.id) !== String(id)) {
    void router.replace('/');
    return;
  }
}

onMounted(() => loadUser(route.params.id));
watch(
  () => route.params.id,
  (newId) => loadUser(newId),
);

onBeforeUnmount(() => {
  userStore.clearCurrentUser();
});
</script>

<style scoped></style>
