<template>
  <q-card flat bordered class="q-pa-md form-card">
    <q-form ref="formRef" class="q-gutter-md" @submit.prevent="onSubmit">
      <q-card-section class="q-pb-none">
        <div class="row items-start">
          <div>
            <div class="text-h6">Создание пользователя</div>
            <div class="text-caption text-grey">Заполните поля ниже</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.blogName"
          label="Название блога"
          outlined
          clearable
          :rules="[rules.required, rules.max50]"
          :disable="submitting"
          :maxlength="50"
        >
          <template #prepend>
            <q-icon name="campaign" />
          </template>
        </q-input>

        <q-input
          v-model="formData.fullName"
          label="Полное имя"
          outlined
          clearable
          :rules="[rules.required, rules.max50]"
          :disable="submitting"
          :maxlength="50"
          class="q-mt-md"
        >
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator inset />

      <q-card-actions align="right">
        <q-btn label="Создать" type="submit" color="secondary" :loading="submitting" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notify, type QForm } from 'quasar';
import { api } from 'src/boot/axios';

type CreateUserRequest = {
  blogName: string;
  fullName: string;
};

type CommentDto = {
  dateTime: string;
  email: string;
  id: number;
  textComment: string;
  userInfo: string;
};

type PostDto = {
  briefDescription: string;
  comments: CommentDto[];
  dateTime: string;
  fullDescription: string;
  id: number;
  title: string;
};

type CreateUserResponse = {
  blogName: string;
  fullName: string;
  id: number;
  post: PostDto[];
};

const formRef = ref<QForm | null>(null);
const submitting = ref(false);
const router = useRouter();

const formData = reactive<CreateUserRequest>({
  blogName: '',
  fullName: '',
});

const rules = {
  required: (val: string) => (val && val.toString().trim().length > 0) || 'Обязательное поле',
  max50: (val: string) => !val || val.length <= 50 || 'Максимум 50 символов',
};

async function onSubmit() {
  if (!formRef.value) return;
  const validationResult = formRef.value.validate();
  const valid = typeof validationResult === 'boolean' ? validationResult : await validationResult;
  if (!valid) return;

  submitting.value = true;
  try {
    const payload: CreateUserRequest = {
      blogName: formData.blogName.trim(),
      fullName: formData.fullName.trim(),
    };
    await api.post<CreateUserResponse>('/userInfo', payload);
    Notify.create({ type: 'positive', message: 'Пользователь создан' });
    await router.push('/users');

    onReset();
  } catch (e) {
    console.error(e);
    Notify.create({ type: 'negative', message: 'Ошибка создания пользователя' });
  } finally {
    submitting.value = false;
  }
}

function onReset() {
  formData.blogName = '';
  formData.fullName = '';
}
</script>

<style scoped>
.form-card {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
</style>
