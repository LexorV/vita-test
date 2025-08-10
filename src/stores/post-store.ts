import { defineStore, acceptHMRUpdate } from 'pinia';

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    targetUserId: null as number | null,
  }),

  getters: {
    hasTargetUser: (state) => state.targetUserId !== null,
  },

  actions: {
    setTargetUserId(userId: number | null) {
      this.targetUserId = userId;
    },
    clearTargetUser() {
      this.targetUserId = null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot));
}
