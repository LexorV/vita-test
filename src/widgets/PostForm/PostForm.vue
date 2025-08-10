<template>
  <q-card class="form-card" bordered>
    <q-card-section class="row items-center q-gutter-sm">
      <q-icon name="article" color="primary" size="28px" />
      <div class="text-h6">{{ isEdit ? 'Редактирование поста' : 'Создание поста' }}</div>
    </q-card-section>

    <q-separator spaced />

    <q-card-section>
      <q-form @submit.prevent="onSubmit" @reset.prevent="onReset" ref="formRef" class="q-gutter-md">
        <q-input
          v-model="formData.title"
          label="Заголовок"
          :rules="[rules.required, rules.max50]"
          outlined
          clearable
          :disable="submitting"
          maxlength="50"
          hint="До 50 символов"
        >
          <template #prepend>
            <q-icon name="title" />
          </template>
        </q-input>

        <q-input
          v-model="formData.briefDescription"
          label="Краткое описание"
          :rules="[rules.required, rules.max100]"
          type="textarea"
          autogrow
          outlined
          clearable
          :disable="submitting"
          maxlength="100"
          hint="Краткий текст, до 100 символов"
        >
          <template #prepend>
            <q-icon name="short_text" />
          </template>
        </q-input>

        <q-input
          v-model="formData.fullDescription"
          label="Полное описание"
          :rules="[rules.max255]"
          type="textarea"
          autogrow
          outlined
          clearable
          :disable="submitting"
          maxlength="255"
          hint="Раскройте подробности, до 255 символов"
        >
          <template #prepend>
            <q-icon name="description" />
          </template>
        </q-input>

        <q-card-actions align="right" class="q-pa-none">
          <q-btn
            :label="isEdit ? 'Сохранить' : 'Создать'"
            type="submit"
            color="primary"
            :loading="submitting"
            icon="save"
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
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify, type QForm } from 'quasar';
import { createPost, updatePost } from 'src/shared/api/api';
import type { CreatePostRequest, UpdatePostRequest } from 'src/shared/api/api';
import { usePostStore } from 'src/stores/post-store';

const props = withDefaults(
  defineProps<{
    isEdit: boolean;
    initialId?: number;
    initialTitle?: string;
    initialBriefDescription?: string;
    initialFullDescription?: string;
  }>(),
  {
    isEdit: false,
    initialTitle: '',
    initialBriefDescription: '',
    initialFullDescription: '',
  },
);

const formRef = ref<QForm | null>(null);
const submitting = ref(false);

const postStore = usePostStore();
const router = useRouter();

const formData = reactive<{
  userInfoId: number | null;
  title: string;
  briefDescription: string;
  fullDescription: string;
}>({
  userInfoId: null,
  title: props.initialTitle,
  briefDescription: props.initialBriefDescription,
  fullDescription: props.initialFullDescription,
});

const rules = {
  required: (val: string) => (val && val.toString().trim().length > 0) || 'Обязательное поле',
  max50: (val: string) => !val || val.length <= 50 || 'Максимум 50 символов',
  max100: (val: string) => !val || val.length <= 100 || 'Максимум 100 символов',
  max255: (val: string) => !val || val.length <= 255 || 'Максимум 255 символов',
  userRequired: (val: number | null) =>
    (val !== null && !Number.isNaN(val)) || 'Выберите пользователя',
};

onMounted(() => {
  formData.userInfoId = postStore.targetUserId;
});

onBeforeUnmount(() => {
  postStore.clearTargetUser();
});

async function onSubmit() {
  if (!formRef.value) return;
  const validationResult = formRef.value.validate();
  const valid = typeof validationResult === 'boolean' ? validationResult : await validationResult;
  if (!valid) return;
  if (
    !props.isEdit &&
    (formData.userInfoId === null || Number.isNaN(Number(formData.userInfoId)))
  ) {
    Notify.create({ type: 'negative', message: 'Не выбран пользователь' });
    return;
  }
  submitting.value = true;
  try {
    if (props.isEdit) {
      const payload: UpdatePostRequest = {
        id: Number(props.initialId),
        title: formData.title.trim(),
        briefDescription: formData.briefDescription.trim(),
        fullDescription: formData.fullDescription?.trim() || '',
      };
      await updatePost(payload);
      Notify.create({ type: 'positive', message: 'Запись обновлена' });
      postStore.invalidatePosts();
      navigateBack();
    } else {
      const payload: CreatePostRequest = {
        title: formData.title.trim(),
        briefDescription: formData.briefDescription.trim(),
        fullDescription: formData.fullDescription?.trim() || '',
      };
      await createPost(payload, Number(formData.userInfoId));
      Notify.create({ type: 'positive', message: 'Запись создана' });
      postStore.invalidatePosts();
      navigateBack();
    }
  } catch (error) {
    console.error(error);
    Notify.create({ type: 'negative', message: 'Ошибка запроса' });
  } finally {
    submitting.value = false;
  }
}

function onReset() {
  formData.userInfoId = postStore.targetUserId;
  formData.title = '';
  formData.briefDescription = '';
  formData.fullDescription = '';
}

function navigateBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    void router.back();
  } else {
    void router.push('/');
  }
}
</script>

<style scoped>
.form-card {
  max-width: 760px;
  margin: 0 auto;
}
</style>
