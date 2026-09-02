<template>
  <div class="page member-page">
    <section v-if="!userStore.token" class="guest-card surface-card">
      <span class="avatar"><SvgIcon name="user" /></span>
      <h1>{{ t('common.member.guestTitle') }}</h1>
      <p>{{ t('common.member.guestDescription') }}</p>
      <RouterLink to="/login">{{ t('common.member.login') }}</RouterLink>
    </section>
    <template v-else>
      <section class="profile-card surface-card">
        <span class="avatar"><SvgIcon name="user" /></span>
        <div>
          <small>{{ t('common.member.signedIn') }}</small>
          <h1>
            {{
              profileQuery.data.value?.name ??
              userStore.getUserInfo?.name ??
              t('common.member.loading')
            }}
          </h1>
          <p>
            {{
              t('common.member.plan', {
                role: profileQuery.data.value?.role ?? '—',
                plan: profileQuery.data.value?.plan ?? '—',
              })
            }}
          </p>
        </div>
      </section>
      <section class="settings surface-card">
        <div>
          <b>{{ t('common.member.session') }}</b
          ><span>{{ t('common.member.sessionDescription') }}</span>
        </div>
        <div>
          <b>{{ t('common.member.serverProfile') }}</b
          ><span>{{ t('common.member.serverProfileDescription') }}</span>
        </div>
        <button type="button" @click="logout">
          {{ t('common.member.logout') }}
        </button>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { getUserProfile } from '@/api/modules/user';
import { useUserStore } from '@/store/modules/user';
const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const profileQuery = useQuery({
  queryKey: ['user', 'profile'],
  queryFn: ({ signal }) => getUserProfile(signal),
  enabled: computed(() => Boolean(userStore.token)),
});
const logout = async () => {
  userStore.logout();
  await router.replace('/home');
};
</script>

<style scoped lang="scss">
.member-page {
  display: grid;
  gap: var(--space-4);
  align-content: start;
}

.guest-card {
  width: 100%;
  max-width: 34rem;
  padding: var(--space-6) 0;
  margin: 0;
  text-align: left;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--color-border);
  box-shadow: none;

  .avatar {
    margin: 0;
  }

  h1 {
    margin: var(--space-4) 0 var(--space-2);
    font-size: var(--text-section-title);
    font-weight: 680;
  }

  p {
    max-width: 30rem;
    margin: 0 0 var(--space-5);
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  a {
    display: inline-grid;
    place-items: center;
    min-width: 8rem;
    min-height: var(--touch-target);
    padding: 0 var(--space-4);
    color: var(--color-primary-contrast);
    text-decoration: none;
    background: var(--color-primary);
    border-radius: var(--radius-md);
  }
}

.avatar {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);

  .svg-icon {
    font-size: 1.25rem;
  }
}

.profile-card {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-5);
  margin-top: var(--space-3);
  box-shadow: none;

  small {
    color: var(--color-success);
  }

  h1 {
    margin: var(--space-1) 0;
    font-size: var(--text-section-title);
    font-weight: 680;
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
  }
}

.settings {
  display: grid;
  gap: 0;
  box-shadow: none;

  div {
    display: flex;
    gap: var(--space-4);
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border);

    b {
      font-weight: 650;
    }

    span {
      font-size: var(--text-secondary);
      color: var(--color-text-secondary);
    }
  }

  button {
    justify-self: end;
    min-width: 8rem;
    min-height: var(--touch-target);
    padding: 0 var(--space-4);
    margin-top: var(--space-4);
    color: var(--color-danger);
    background: transparent;
    border: 1px solid currentcolor;
    border-radius: var(--radius-md);
  }
}

@media (max-width: 420px) {
  .settings div {
    flex-direction: column;
    gap: var(--space-1);
    align-items: flex-start;
  }
}
</style>
