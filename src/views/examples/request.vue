<template>
  <div class="page request-page">
    <header class="page-header">
      <div>
        <small class="eyebrow">{{ t('common.request.eyebrow') }}</small>
        <h1>{{ t('common.request.title') }}</h1>
        <p>{{ t('common.request.description') }}</p>
      </div>
    </header>
    <section class="type-strip" aria-label="API types">
      <code>ApiResponse&lt;T&gt;</code><code>ApiError</code
      ><code>PaginationResponse&lt;T&gt;</code>
    </section>

    <section class="error-section">
      <div class="section-header">
        <div>
          <small class="eyebrow">{{ t('common.request.errorMatrix') }}</small>
          <h2>{{ t('common.request.errorTitle') }}</h2>
        </div>
      </div>
      <div class="error-list">
        <article v-for="scenario in scenarios" :key="scenario.id">
          <div>
            <b>{{ scenario.status }}</b
            ><span>{{ scenario.title }}</span>
            <p>{{ scenario.description }}</p>
          </div>
          <button
            class="button-secondary"
            type="button"
            :disabled="pending === scenario.id"
            @click="runScenario(scenario.id)"
          >
            {{
              pending === scenario.id
                ? t('common.global.loading')
                : t('common.request.trigger')
            }}
          </button>
          <dl v-if="results[scenario.id]">
            <div>
              <dt>kind</dt>
              <dd>{{ results[scenario.id]?.kind }}</dd>
            </div>
            <div>
              <dt>status</dt>
              <dd>{{ results[scenario.id]?.status ?? '—' }}</dd>
            </div>
            <div>
              <dt>message</dt>
              <dd>{{ results[scenario.id]?.message }}</dd>
            </div>
            <div v-if="results[scenario.id]?.requestId">
              <dt>requestId</dt>
              <dd>{{ results[scenario.id]?.requestId }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
    <p class="request-note">{{ t('common.request.redirectNote') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { triggerRequestError } from '@/api/modules/requestExamples';
import type { RequestErrorScenario } from '@/api/modules/requestExamples';
import { isApiError } from '@/types/api/common';
import type { ApiErrorKind } from '@/types/api/common';

interface ErrorResult {
  kind: ApiErrorKind;
  message: string;
  requestId?: string;
  status?: number;
}
const { t } = useI18n();
const pending = ref<RequestErrorScenario | null>(null);
const results = reactive<Partial<Record<RequestErrorScenario, ErrorResult>>>(
  {},
);
const scenarios = computed<
  Array<{
    id: RequestErrorScenario;
    status: string;
    title: string;
    description: string;
  }>
>(() => [
  {
    id: 'bad-request',
    status: '400',
    title: t('common.request.scenarios.badRequest'),
    description: t('common.request.scenarios.badRequestDescription'),
  },
  {
    id: 'unauthorized',
    status: '401',
    title: t('common.request.scenarios.unauthorized'),
    description: t('common.request.scenarios.unauthorizedDescription'),
  },
  {
    id: 'forbidden',
    status: '403',
    title: t('common.request.scenarios.forbidden'),
    description: t('common.request.scenarios.forbiddenDescription'),
  },
  {
    id: 'not-found',
    status: '404',
    title: t('common.request.scenarios.notFound'),
    description: t('common.request.scenarios.notFoundDescription'),
  },
  {
    id: 'conflict',
    status: '409',
    title: t('common.request.scenarios.conflict'),
    description: t('common.request.scenarios.conflictDescription'),
  },
  {
    id: 'validation',
    status: '422',
    title: t('common.request.scenarios.validation'),
    description: t('common.request.scenarios.validationDescription'),
  },
  {
    id: 'server-error',
    status: '500',
    title: t('common.request.scenarios.serverError'),
    description: t('common.request.scenarios.serverErrorDescription'),
  },
  {
    id: 'timeout',
    status: 'TIMEOUT',
    title: t('common.request.scenarios.timeout'),
    description: t('common.request.scenarios.timeoutDescription'),
  },
]);
const runScenario = async (scenario: RequestErrorScenario) => {
  pending.value = scenario;
  results[scenario] = undefined;
  try {
    await triggerRequestError(scenario);
  } catch (error) {
    results[scenario] = isApiError(error)
      ? {
          kind: error.kind,
          message: error.message,
          requestId: error.requestId,
          status: error.status,
        }
      : { kind: 'unknown', message: t('common.request.unknownError') };
  } finally {
    pending.value = null;
  }
};
</script>

<style scoped lang="scss">
.type-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.type-strip code {
  padding: var(--space-2) var(--space-3);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border-radius: var(--radius-sm);
}

.error-section {
  padding-top: var(--space-6);
}

.error-list {
  border-top: 1px solid var(--color-border);
}

.error-list article {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.error-list b {
  display: inline-block;
  min-width: 4.25rem;
  font-family: var(--font-mono);
  color: var(--color-danger);
}

.error-list span {
  font-weight: 650;
}

.error-list p {
  margin: var(--space-1) 0 0;
  color: var(--color-text-secondary);
}

.error-list button {
  align-self: center;
}

.error-list dl {
  grid-column: 1 / -1;
  padding: var(--space-3);
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  background: var(--color-background-soft);
  border-radius: var(--radius-md);
}

.error-list dl div {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: var(--space-2);
}

.error-list dt {
  color: var(--color-text-muted);
}

.error-list dd {
  margin: 0;
  overflow-wrap: anywhere;
}

.request-note {
  color: var(--color-text-secondary);
}

@media (max-width: 520px) {
  .error-list article {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .error-list button {
    justify-self: start;
  }

  .error-list dl {
    grid-column: auto;
  }
}
</style>
