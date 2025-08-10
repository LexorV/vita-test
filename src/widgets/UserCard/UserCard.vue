<template>
  <q-card class="q-mb-lg">
    <q-card-section class="row items-center justify-between">
      <div>
        <div class="text-h5">{{ user.blogName }}</div>
        <div class="text-caption text-grey-7">Автор: {{ user.fullName }}</div>
      </div>
      <div class="row items-center q-gutter-sm">
        <div class="text-caption text-grey-6">Записей: {{ user.post?.length ?? 0 }}</div>
        <q-btn color="primary" icon="add" label="Создать пост" dense @click="goCreatePost" />
      </div>
    </q-card-section>

    <q-separator />

    <q-list separator>
      <template v-if="user.post && user.post.length">
        <PostComponent
          v-for="post in user.post"
          :key="post.id"
          :post="post"
          :author="user.fullName"
          :show-actions="true"
          @deleted="onPostDeleted"
        />
      </template>
      <template v-else>
        <div class="q-pa-md text-grey-6">У пользователя пока нет записей</div>
      </template>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from 'src/stores/user-store';
import { usePostStore } from 'src/stores/post-store';
import { useRouter } from 'vue-router';
import { PostComponent } from 'src/entities';

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const user = computed(() => currentUser.value!);

const postStore = usePostStore();
const router = useRouter();

function goCreatePost() {
  postStore.setTargetUserId(user.value.id);
  void router.push({ path: '/create-post' });
}

function onPostDeleted(id: number) {
  const updated = user.value.post.filter((p) => p.id !== id);
  user.value.post.splice(0, user.value.post.length, ...updated);
}
</script>

<style scoped>
.text-body2 {
  white-space: pre-line;
}
</style>
