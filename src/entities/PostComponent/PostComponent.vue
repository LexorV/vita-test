<template>
  <q-item class="q-py-md post-clickable" clickable v-ripple @click="goToPost">
    <q-item-section>
      <div class="row items-center justify-between q-mb-xs">
        <div class="col">
          <div class="text-subtitle1">{{ post.title }}</div>
          <div class="text-caption">
            Автор:
            <span class="author-link" @click.stop="goToAuthor">{{ author }}</span>
          </div>
        </div>
        <div class="col-auto text-caption text-grey-6">Дата: {{ post.dateTime }}</div>
      </div>
      <div class="text-body2">{{ post.briefDescription }}</div>
      <div class="row items-center justify-between q-mt-sm">
        <div class="text-caption text-grey-7">Комментариев: {{ post.comments?.length ?? 0 }}</div>
        <div v-if="showActions" class="row items-center q-gutter-sm">
          <q-btn
            color="primary"
            icon="edit"
            label="Редактировать"
            outline
            dense
            @click.stop="onEdit"
          />
          <q-btn
            color="negative"
            icon="delete"
            label="Удалить"
            flat
            dense
            @click.stop="onDelete"
            :loading="deleting"
          />
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { usePostStore } from 'src/stores/post-store';
import { useUserStore } from 'src/stores/user-store';
import type { PostForUser } from 'src/types/types';

const props = defineProps<{
  post: PostForUser;
  author: string;
  userId?: number;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  (e: 'deleted', id: number): void;
}>();

const router = useRouter();
const postStore = usePostStore();
const userStore = useUserStore();
const deleting = ref(false);

function onEdit() {
  postStore.setEditInitialFromPost(props.post);
  void router.push({ path: `/change-post/${props.post.id}` });
}

function goToPost() {
  void router.push({ path: `/post/${props.post.id}` });
}

function goToAuthor() {
  if (props.userId != null) {
    const user = postStore.getUserById(props.userId);
    if (user) {
      userStore.setCurrentUser(user);
      void router.push({ path: `/user/${props.userId}` });
    } else {
      void router.push({ path: `/user/${props.userId}` });
    }
  }
}

async function onDelete() {
  if (deleting.value) return;
  deleting.value = true;
  try {
    await api.delete(`/post/${props.post.id}`);
    emit('deleted', props.post.id);
  } catch (err) {
    console.error('Не удалось удалить пост', err);
  } finally {
    deleting.value = false;
  }
}
</script>

<style scoped>
.text-body2 {
  white-space: pre-line;
}
.post-clickable {
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.post-clickable:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.author-link {
  color: var(--q-primary);
  cursor: pointer;
  text-decoration: underline;
}
</style>
