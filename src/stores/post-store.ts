import { defineStore, acceptHMRUpdate } from 'pinia';
import { api } from 'src/boot/axios';
import type { PostForUser, User } from 'src/types/types';

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Array<{ post: PostForUser; author: string; userId: number }>,
    isLoaded: false,
    usersById: {} as Record<number, User>,
    targetUserId: null as number | null,
    editInitial: null as {
      id: number;
      title: string;
      briefDescription: string;
      fullDescription?: string;
    } | null,
  }),

  getters: {
    sortedPosts: (state) =>
      [...state.posts].sort(
        (a, b) => new Date(b.post.dateTime).getTime() - new Date(a.post.dateTime).getTime(),
      ),
    getUserById: (state) => (id: number) => state.usersById[id] || null,
    hasTargetUser: (state) => state.targetUserId !== null,
    hasEditInitial: (state) => state.editInitial !== null,
  },

  actions: {
    async fetchAllPosts(): Promise<void> {
      if (this.isLoaded && this.posts.length > 0) return;
      const { data } = await api.get<User[]>('/userInfo/findAll');
      const flattened: Array<{ post: PostForUser; author: string; userId: number }> = [];
      const usersIndex: Record<number, User> = {};
      for (const user of data ?? []) {
        usersIndex[user.id] = user;
        const authorName = user.fullName || user.blogName || '';
        for (const p of user.post ?? []) {
          flattened.push({ post: p, author: authorName, userId: user.id });
        }
      }
      this.posts = flattened.sort(
        (a, b) => new Date(b.post.dateTime).getTime() - new Date(a.post.dateTime).getTime(),
      );
      this.usersById = usersIndex;
      this.isLoaded = true;
    },
    invalidatePosts() {
      this.isLoaded = false;
    },
    removePostById(id: number) {
      this.posts = this.posts.filter((x) => x.post.id !== id);
    },
    setTargetUserId(userId: number | null) {
      this.targetUserId = userId;
    },
    clearTargetUser() {
      this.targetUserId = null;
    },
    setEditInitialFromPost(post: PostForUser) {
      this.editInitial = {
        id: post.id,
        title: post.title,
        briefDescription: post.briefDescription,
        fullDescription: post.fullDescription,
      };
    },
    clearEditInitial() {
      this.editInitial = null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot));
}
