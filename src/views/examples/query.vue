<template>
  <div class="page query-page">
    <section class="intro surface-card">
      <span>{{ t('common.query.eyebrow') }}</span>
      <h1>TanStack Query</h1>
      <p>{{ t('common.query.description') }}</p>
    </section>

    <section class="section-block">
      <div class="section-title">
        <div>
          <span>{{ t('common.query.queryMutation') }}</span>
          <h2>{{ t('common.query.checklist') }}</h2>
        </div>
        <button
          type="button"
          :disabled="tasksQuery.isFetching.value"
          @click="tasksQuery.refetch()"
        >
          {{ t('common.query.refresh') }}
        </button>
      </div>
      <p v-if="tasksQuery.isPending.value" class="state-card">
        {{ t('common.query.loadingTasks') }}
      </p>
      <p
        v-else-if="tasksQuery.isError.value"
        class="state-card state-card--error"
      >
        {{ tasksQuery.error.value?.message }}
      </p>
      <div v-else class="task-list">
        <button
          v-for="task in tasksQuery.data.value"
          :key="task.id"
          type="button"
          :disabled="toggleMutation.isPending.value"
          @click="toggleMutation.mutate(task.id)"
        >
          <span :class="{ checked: task.done }">{{ task.done ? '✓' : '' }}</span
          ><b>{{ t(`common.query.tasks.${task.id}`, task.title) }}</b
          ><small>{{
            task.done ? t('common.query.done') : t('common.query.todo')
          }}</small>
        </button>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title">
        <div>
          <span>{{ t('common.query.infinite') }}</span>
          <h2>{{ t('common.query.feed') }}</h2>
        </div>
      </div>
      <div class="feed-list">
        <article v-for="item in feedItems" :key="item.id" class="surface-card">
          <span>{{ getFeedCategory(item.id) }}</span>
          <h3>{{ getFeedTitle(item.id) }}</h3>
          <p>{{ t('common.query.feedItems.summary', { index: item.id }) }}</p>
        </article>
      </div>
      <button
        v-if="feedQuery.hasNextPage.value"
        ref="loadMoreTarget"
        class="load-more"
        type="button"
        :disabled="feedQuery.isFetchingNextPage.value"
        @click="feedQuery.fetchNextPage()"
      >
        {{
          feedQuery.isFetchingNextPage.value
            ? t('common.query.loadingMore')
            : t('common.query.loadMore')
        }}
      </button>
      <p v-else class="end-text">{{ t('common.query.end') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  useTemplateRef,
  watch,
} from 'vue';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { getFeed, getTasks, toggleTask } from '@/api/modules/examples';
import type { Task } from '@/api/modules/examples';

const queryClient = useQueryClient();
const { t } = useI18n();
const tasksQuery = useQuery({
  queryKey: ['examples', 'tasks'],
  queryFn: ({ signal }) => getTasks(signal),
});
const toggleMutation = useMutation({
  mutationFn: toggleTask,
  onSuccess: (updated) =>
    queryClient.setQueryData<Task[]>(['examples', 'tasks'], (current = []) =>
      current.map((task) => (task.id === updated.id ? updated : task)),
    ),
});
const feedQuery = useInfiniteQuery({
  queryKey: ['examples', 'feed'],
  initialPageParam: 0,
  queryFn: ({ pageParam, signal }) => getFeed(pageParam, 6, signal),
  getNextPageParam: (lastPage) =>
    lastPage.hasMore ? lastPage.page * lastPage.pageSize : undefined,
});
const feedItems = computed(
  () => feedQuery.data.value?.pages.flatMap((page) => page.list) ?? [],
);
const feedTitleKeys = [
  'performanceTitle',
  'streamingTitle',
  'architectureTitle',
] as const;
const feedCategoryKeys = ['performance', 'ai', 'architecture'] as const;
const getFeedTitle = (id: number) =>
  t(`common.query.feedItems.${feedTitleKeys[(id - 1) % feedTitleKeys.length]}`);
const getFeedCategory = (id: number) =>
  t(
    `common.query.feedItems.${feedCategoryKeys[(id - 1) % feedCategoryKeys.length]}`,
  );
const loadMoreTarget = useTemplateRef<HTMLButtonElement>('loadMoreTarget');
let observer: IntersectionObserver | undefined;
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (
        entry?.isIntersecting &&
        feedQuery.hasNextPage.value &&
        !feedQuery.isFetchingNextPage.value
      )
        void feedQuery.fetchNextPage();
    },
    { rootMargin: '160px' },
  );
  if (loadMoreTarget.value) observer.observe(loadMoreTarget.value);
});
watch(loadMoreTarget, (target, previousTarget) => {
  if (previousTarget) observer?.unobserve(previousTarget);
  if (target) observer?.observe(target);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped lang="scss">
.intro {
  padding: var(--space-5);

  span,
  .section-title span {
    font-size: var(--text-caption);
    font-weight: 650;
    color: var(--color-text-secondary);
    letter-spacing: 0.12em;
  }

  h1 {
    margin: var(--space-1) 0 var(--space-2);
    font-size: var(--text-page-title);
    font-weight: 680;
  }

  p {
    margin: 0;
    line-height: 1.55;
    color: var(--color-text-secondary);
  }
}

.section-block {
  margin-top: var(--space-8);
}

.section-title {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin-bottom: var(--space-4);

  span {
    font-size: var(--text-caption);
    font-weight: 650;
    color: var(--color-text-secondary);
  }

  h2 {
    margin: var(--space-1) 0 0;
    font-size: var(--text-section-title);
    font-weight: 650;
  }

  > button {
    min-height: var(--touch-target);
    padding: 0 var(--space-3);
    color: var(--color-text-secondary);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }
}

.task-list {
  display: grid;
  gap: var(--space-3);

  button {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--space-3);
    align-items: center;
    min-height: var(--touch-target);
    padding: var(--space-3) var(--space-4);
    color: var(--color-text);
    text-align: left;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);

    > span {
      display: grid;
      place-items: center;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--color-primary-contrast);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-sm);

      &.checked {
        background: var(--color-success);
        border-color: var(--color-success);
      }
    }

    b {
      font-weight: 620;
    }

    small {
      color: var(--color-text-secondary);
    }
  }
}

.feed-list {
  display: grid;
  gap: var(--space-3);

  article {
    padding: var(--space-4);

    span {
      font-size: var(--text-caption);
      font-weight: 650;
      color: var(--color-text-secondary);
    }

    h3 {
      margin: var(--space-2) 0 var(--space-1);
      font-size: var(--text-card-title);
      font-weight: 650;
    }

    p {
      margin: 0;
      color: var(--color-text-secondary);
    }
  }
}

.state-card,
.load-more,
.end-text {
  width: 100%;
  padding: var(--space-5);
  color: var(--color-text-secondary);
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.state-card--error {
  color: var(--color-danger);
}

.load-more {
  margin-top: var(--space-4);
  color: var(--color-primary);
}

.end-text {
  background: transparent;
  border: 0;
}
</style>
