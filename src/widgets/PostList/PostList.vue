<template>
  <div>
    <div v-if="loading" class="q-pa-md">Загрузка...</div>
    <div v-else-if="error" class="q-pa-md text-negative">{{ error }}</div>
    <q-list v-else bordered separator>
      <PostComponent
        v-for="item in posts"
        :key="item.post.id"
        :post="item.post"
        :author="item.author"
        :user-id="item.userId"
        :show-actions="false"
        @deleted="handleDeleted"
      />
      <div v-if="posts.length === 0" class="q-pa-md text-grey">Записей пока нет</div>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePostStore } from 'src/stores/post-store';
import { PostComponent } from 'src/entities';

const postStore = usePostStore();
const loading = ref(false);
const error = ref<string | null>(null);

const posts = computed(() => postStore.sortedPosts);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    await postStore.fetchAllPosts();
  } catch {
    error.value = 'Не удалось загрузить список записей';
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function handleDeleted(id: number) {
  postStore.removePostById(id);
}
</script>

<style scoped></style>
