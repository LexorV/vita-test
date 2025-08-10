import { api } from 'src/boot/axios';

export type CreatePostRequest = {
  title: string;
  briefDescription: string;
  fullDescription?: string;
};

export type UpdatePostRequest = {
  id: number;
  title: string;
  briefDescription: string;
  fullDescription?: string;
};

export type PostComment = {
  id: number;
  email: string;
  textComment: string;
  userInfo: string;
  dateTime: string;
};

export type PostResponse = {
  id: number;
  title: string;
  briefDescription: string;
  fullDescription?: string;
  userInfoId: number;
  dateTime: string;
  comments: PostComment[];
};

export async function createPost(
  payload: CreatePostRequest,
  userInfoId: number,
): Promise<PostResponse> {
  const { data } = await api.post<PostResponse>('/post', payload, {
    params: { userInfoId },
  });
  return data;
}

export async function updatePost(payload: UpdatePostRequest): Promise<PostResponse> {
  const { data } = await api.put<PostResponse>('/post', payload);
  return data;
}
