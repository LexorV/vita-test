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
        <q-item v-for="post in user.post" :key="post.id" class="q-py-md">
          <q-item-section>
            <div class="row items-center justify-between q-mb-xs">
              <div class="col">
                <div class="text-subtitle1">{{ post.title }}</div>
                <div class="text-caption text-grey-7">Автор: {{ user.fullName }}</div>
              </div>
              <div class="col-auto text-caption text-grey-6">Дата: {{ post.dateTime }}</div>
            </div>
            <div class="text-body2">{{ post.briefDescription }}</div>
            <div class="q-mt-sm text-caption text-grey-7">
              Комментариев: {{ post.comments?.length ?? 0 }}
            </div>
          </q-item-section>
        </q-item>
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

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const user = computed(() => currentUser.value!);

const postStore = usePostStore();
const router = useRouter();

function goCreatePost() {
  postStore.setTargetUserId(user.value.id);
  void router.push({ path: '/create-post' });
}
</script>

<style scoped>
.text-body2 {
  white-space: pre-line;
}
</style>
