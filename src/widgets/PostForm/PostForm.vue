<template>
  <q-form @submit.prevent="onSubmit" @reset.prevent="onReset" ref="formRef" class="q-gutter-md">
    <q-input v-model="formData.userInfoId" label="Пользователь" outlined :disable="true" />
    <q-input
      v-model="formData.title"
      label="Заголовок"
      :rules="[rules.required, rules.max50]"
      outlined
      clearable
      :disable="submitting"
    />

    <q-input
      v-model="formData.briefDescription"
      label="Краткое описание"
      :rules="[rules.required, rules.max100]"
      type="textarea"
      autogrow
      outlined
      clearable
      :disable="submitting"
    />

    <q-input
      v-model="formData.fullDescription"
      label="Полное описание"
      :rules="[rules.max255]"
      type="textarea"
      autogrow
      outlined
      clearable
      :disable="submitting"
    />

    <div class="row q-col-gutter-md">
      <div class="col-auto">
        <q-btn
          :label="isEdit ? 'Сохранить' : 'Создать'"
          type="submit"
          color="secondary"
          :loading="submitting"
        />
      </div>
      <div class="col-auto">
        <q-btn label="Сбросить" type="reset" color="secondary" flat :disable="submitting" />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue';
import { Notify, type QForm } from 'quasar';
import {
  createPost,
  updatePost,
  type CreatePostRequest,
  type UpdatePostRequest,
} from './api/PostApi';
// import { api } from 'src/boot/axios';
import { usePostStore } from 'src/stores/post-store';

const props = withDefaults(
  defineProps<{
    isEdit: boolean;
    // при редактировании нужно передать id и стартовые значения
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
    } else {
      const payload: CreatePostRequest = {
        title: formData.title.trim(),
        briefDescription: formData.briefDescription.trim(),
        fullDescription: formData.fullDescription?.trim() || '',
      };
      await createPost(payload, Number(formData.userInfoId));
      Notify.create({ type: 'positive', message: 'Запись создана' });
      onReset();
    }
  } catch (error) {
    console.error(error);
    Notify.create({ type: 'negative', message: 'Ошибка запроса' });
    // Можно расширить обработку ошибок при необходимости
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
</script>

<style scoped>
.q-form {
  max-width: 640px;
}
</style>
