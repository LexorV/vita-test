<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Пользователи</div>
      <div class="row items-center">
        <q-btn
          color="primary"
          label="Создать пользователя"
          class="q-mr-sm"
          :to="{ path: '/create-user' }"
        />
        <q-btn outline color="primary" label="Обновить" @click="fetchUsers" :loading="loading" />
      </div>
    </div>
    <q-list separator>
      <UserComponent v-for="item in users" :key="item.id" :user="item" @deleted="removeUser" />
    </q-list>
  </div>
  <div v-if="!loading && users.length === 0" class="q-pa-md text-grey">Список пуст</div>
  <div v-if="loading" class="q-pa-md">Загрузка...</div>
  <div v-if="error" class="q-pa-md text-negative">{{ error }}</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { UserComponent } from 'src/entities';
import type { User } from 'src/types/types';

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function fetchUsers() {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get<User[]>('/userInfo/findAll');
    users.value = response.data ?? [];
  } catch (err) {
    console.error(err);
    error.value = 'Не удалось загрузить пользователей';
  } finally {
    loading.value = false;
  }
}

function removeUser(id: number) {
  users.value = users.value.filter((u) => u.id !== id);
}

onMounted(fetchUsers);
</script>

<style scoped></style>
