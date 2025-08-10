<template>
  <q-page padding>
    <div v-if="loading" class="q-pa-md">Загрузка...</div>
    <div v-else-if="error" class="q-pa-md text-negative">{{ error }}</div>
    <div v-else-if="!post" class="q-pa-md">Пост не найден</div>
    <template v-else>
      <PostCard :post="post" />
      <q-card class="q-mb-lg">
        <q-card-section v-if="post.fullDescription">
          <div class="text-body1">{{ post.fullDescription }}</div>
        </q-card-section>
      </q-card>

      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1">Комментарии ({{ post.comments?.length ?? 0 }})</div>
        <q-btn
          v-if="!showCommentForm"
          color="primary"
          label="Добавить комментарий"
          @click="showCommentForm = true"
        />
      </div>
      <div v-if="showCommentForm" class="q-mb-md">
        <CommentForm v-if="post" :post-id="post.id" @submitted="handleCommentSubmitted" />
      </div>
      <q-list bordered separator class="q-mb-lg">
        <CommentComponent
          v-for="c in post.comments || []"
          :key="c.id"
          :comment="c"
          @delete="deleteComment"
        />
        <div v-if="!post.comments || post.comments.length === 0" class="q-pa-md text-grey">
          Комментариев пока нет
        </div>
      </q-list>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { PostCard, CommentForm } from 'src/widgets';
import { CommentComponent } from 'src/entities';
import type { PostResponse, PostComment } from 'src/shared/api/api';
import { Notify } from 'quasar';

const route = useRoute();
const router = useRouter();

const post = ref<PostResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const showCommentForm = ref(false);

async function loadPost() {
  const id = route.params.id as string;
  if (!id) {
    void router.replace('/');
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const { data } = await api.get<PostResponse>(`/post/${id}`);
    post.value = data ?? null;
    if (post.value && Array.isArray(post.value.comments)) {
      post.value.comments = [...post.value.comments].sort(
        (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
      );
    }
    if (!post.value) void router.replace('/');
  } catch {
    error.value = 'Не удалось загрузить пост';
  } finally {
    loading.value = false;
  }
}

function appendComment(newComment: PostComment) {
  if (!post.value) return;
  post.value.comments = [newComment, ...(post.value.comments || [])];
}

onMounted(loadPost);

function handleCommentSubmitted(newComment: PostComment) {
  appendComment(newComment);
  showCommentForm.value = false;
}

async function deleteComment(commentId: number) {
  if (!post.value) return;
  try {
    await api.delete(`/comment/${commentId}`);
    post.value.comments = (post.value.comments || []).filter((c) => c.id !== commentId);
  } catch {
    Notify.create({ type: 'negative', message: 'Не удалось удалить комментарий' });
  }
}
</script>

<style scoped></style>
