export default async ({ store, req }) => {
  try {
    await store.dispatch('auth/initAuth', req);
  } catch (err) {
    console.error(err);
  }
};
