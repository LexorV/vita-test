<template>
  <q-card class="form-card" bordered>
    <q-card-section class="row items-center q-gutter-sm">
      <q-icon name="chat_bubble_outline" color="primary" size="28px" />
      <div class="text-h6">Добавить комментарий</div>
    </q-card-section>

    <q-separator spaced />

    <q-card-section>
      <q-form @submit.prevent="onSubmit" class="q-gutter-md" ref="formRef">
        <q-input
          v-model="form.userInfo"
          label="Имя"
          outlined
          :rules="[rules.required, rules.max50]"
          :disable="submitting"
          maxlength="50"
          hint="До 50 символов"
        >
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          outlined
          :rules="[rules.email, rules.max50]"
          :disable="submitting"
          maxlength="50"
          hint="Например: name@example.com"
        >
          <template #prepend>
            <q-icon name="email" />
          </template>
        </q-input>
        <q-input
          v-model="form.textComment"
          label="Комментарий"
          type="textarea"
          autogrow
          outlined
          :rules="[rules.required, rules.max255]"
          :disable="submitting"
          maxlength="255"
          hint="До 255 символов"
        >
          <template #prepend>
            <q-icon name="comment" />
          </template>
        </q-input>

        <q-card-actions align="right" class="q-pa-none">
          <q-btn
            label="Добавить комментарий"
            type="submit"
            color="primary"
            :loading="submitting"
            icon="send"
            unelevated
          />
        </q-card-actions>
      </q-form>
    </q-card-section>

    <q-inner-loading :showing="submitting">
      <q-spinner size="42px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Notify, type QForm } from 'quasar';
import { api } from 'src/boot/axios';
import type { PostComment } from 'src/shared/api/api';

const props = defineProps<{ postId: number }>();

const emit = defineEmits<{
  (e: 'submitted', payload: PostComment): void;
}>();

const form = reactive({ userInfo: '', email: '', textComment: '' });
const submitting = ref(false);
const formRef = ref<QForm | null>(null);

const rules = {
  required: (val: string) => (val && val.toString().trim().length > 0) || 'Обязательное поле',
  max50: (val: string) => !val || val.length <= 50 || 'Максимум 50 символов',
  max255: (val: string) => !val || val.length <= 255 || 'Максимум 255 символов',
  email: (val: string) => {
    if (!val) return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val) || 'Некорректный email';
  },
};

async function onSubmit() {
  if (!formRef.value) return;
  const validationResult = formRef.value.validate();
  const valid = typeof validationResult === 'boolean' ? validationResult : await validationResult;
  if (!valid) return;
  submitting.value = true;
  try {
    const payload = { ...form };
    const { data } = await api.post<PostComment>('/comment', payload, {
      params: { postId: props.postId },
    });
    emit('submitted', data);
    form.userInfo = '';
    form.email = '';
    form.textComment = '';
    if (formRef.value) {
      formRef.value.resetValidation();
    }
    Notify.create({ type: 'positive', message: 'Комментарий добавлен' });
  } catch (e) {
    console.error('Не удалось добавить комментарий', e);
    Notify.create({ type: 'negative', message: 'Не удалось добавить комментарий' });
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.form-card {
  max-width: 100%;
  margin: 0 auto;
}
</style>
