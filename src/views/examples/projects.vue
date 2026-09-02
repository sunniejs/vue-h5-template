<template>
  <div class="page workspace-page">
    <header class="page-header">
      <div>
        <small class="eyebrow">{{ t('common.workspace.eyebrow') }}</small>
        <h1>{{ t('common.workspace.title') }}</h1>
        <p>{{ t('common.workspace.description') }}</p>
      </div>
      <button class="button-primary" type="button" @click="openCreate">
        ＋ {{ t('common.workspace.create') }}
      </button>
    </header>

    <div class="workspace-toolbar">
      <label
        ><span>{{ t('common.workspace.filter') }}</span
        ><select v-model="statusFilter">
          <option value="">{{ t('common.workspace.allStatus') }}</option>
          <option value="active">
            {{ t('common.workspace.status.active') }}
          </option>
          <option value="paused">
            {{ t('common.workspace.status.paused') }}
          </option>
          <option value="archived">
            {{ t('common.workspace.status.archived') }}
          </option>
        </select></label
      >
      <button
        class="button-secondary"
        type="button"
        :disabled="projectsQuery.isFetching.value"
        @click="projectsQuery.refetch()"
      >
        {{
          projectsQuery.isFetching.value
            ? t('common.global.loading')
            : t('common.workspace.refresh')
        }}
      </button>
    </div>

    <p v-if="mutationError" class="operation-error" role="alert">
      {{ mutationError }}
    </p>
    <section v-if="projectsQuery.isPending.value" class="state-panel">
      {{ t('common.workspace.loading') }}
    </section>
    <section
      v-else-if="projectsQuery.isError.value"
      class="state-panel"
      role="alert"
    >
      {{ projectsQuery.error.value?.message }}
    </section>
    <section v-else-if="!filteredProjects.length" class="state-panel">
      {{ t('common.workspace.empty') }}
    </section>
    <section v-else class="workspace-list">
      <article v-for="project in filteredProjects" :key="project.id">
        <button
          class="project-main"
          type="button"
          @click="openDetails(project)"
        >
          <span :class="`status status--${project.status}`">{{
            t(`common.workspace.status.${project.status}`)
          }}</span>
          <b>{{ project.name }}</b>
          <p>
            {{ project.description || t('common.workspace.noDescription') }}
          </p>
          <small>{{
            t('common.workspace.updatedAt', {
              date: formatDate(project.updatedAt),
            })
          }}</small>
        </button>
        <div class="row-actions">
          <button type="button" @click="openDetails(project)">
            {{ t('common.workspace.view') }}</button
          ><button type="button" @click="openEdit(project)">
            {{ t('common.workspace.edit') }}</button
          ><button class="danger" type="button" @click="removeProject(project)">
            {{ t('common.workspace.delete') }}
          </button>
        </div>
      </article>
    </section>

    <div
      v-if="dialogMode"
      class="dialog-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="dialogTitle"
      @click.self="closeDialog"
    >
      <section class="workspace-dialog">
        <header>
          <div>
            <small>{{ t(`common.workspace.mode.${dialogMode}`) }}</small>
            <h2>{{ dialogTitle }}</h2>
          </div>
          <button
            type="button"
            :aria-label="t('common.workspace.close')"
            @click="closeDialog"
          >
            ×
          </button>
        </header>
        <template v-if="dialogMode === 'view' && selectedProject">
          <dl class="project-details">
            <div>
              <dt>{{ t('common.workspace.name') }}</dt>
              <dd>{{ selectedProject.name }}</dd>
            </div>
            <div>
              <dt>{{ t('common.workspace.projectDescription') }}</dt>
              <dd>
                {{
                  selectedProject.description ||
                  t('common.workspace.noDescription')
                }}
              </dd>
            </div>
            <div>
              <dt>{{ t('common.workspace.projectStatus') }}</dt>
              <dd>
                {{ t(`common.workspace.status.${selectedProject.status}`) }}
              </dd>
            </div>
            <div>
              <dt>ID</dt>
              <dd>#{{ selectedProject.id }}</dd>
            </div>
            <div>
              <dt>{{ t('common.workspace.createdAt') }}</dt>
              <dd>{{ formatDate(selectedProject.createdAt) }}</dd>
            </div>
          </dl>
          <footer>
            <button
              class="button-secondary"
              type="button"
              @click="openEdit(selectedProject)"
            >
              {{ t('common.workspace.edit') }}</button
            ><button class="button-primary" type="button" @click="closeDialog">
              {{ t('common.workspace.close') }}
            </button>
          </footer>
        </template>
        <form v-else @submit.prevent="saveProject">
          <label
            ><span>{{ t('common.workspace.name') }}</span
            ><input
              v-model.trim="form.name"
              required
              maxlength="120"
              :placeholder="t('common.workspace.namePlaceholder')"
          /></label>
          <label
            ><span>{{ t('common.workspace.projectDescription') }}</span
            ><textarea
              v-model.trim="form.description"
              maxlength="5000"
              rows="4"
              :placeholder="t('common.workspace.descriptionPlaceholder')"
            />
          </label>
          <label
            ><span>{{ t('common.workspace.projectStatus') }}</span
            ><select v-model="form.status">
              <option value="active">
                {{ t('common.workspace.status.active') }}
              </option>
              <option value="paused">
                {{ t('common.workspace.status.paused') }}
              </option>
              <option value="archived">
                {{ t('common.workspace.status.archived') }}
              </option>
            </select></label
          >
          <p v-if="mutationError" class="operation-error" role="alert">
            {{ mutationError }}
          </p>
          <footer>
            <button class="button-secondary" type="button" @click="closeDialog">
              {{ t('common.workspace.cancel') }}</button
            ><button
              class="button-primary"
              type="submit"
              :disabled="saveMutation.isPending.value"
            >
              {{
                saveMutation.isPending.value
                  ? t('common.workspace.saving')
                  : t('common.workspace.save')
              }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '@/api/modules/projects';
import type {
  Project,
  ProjectInput,
  ProjectUpdateInput,
} from '@/api/modules/projects';
import { isApiError } from '@/types/api/common';

type DialogMode = 'create' | 'edit' | 'view';
const { locale, t } = useI18n();
const queryClient = useQueryClient();
const projectsQuery = useQuery({
  queryKey: ['projects', { page: 1, pageSize: 50 }],
  queryFn: ({ signal }) => getProjects({ page: 1, pageSize: 50 }, signal),
});
const statusFilter = ref<'' | Project['status']>('');
const dialogMode = ref<DialogMode | null>(null);
const selectedProject = ref<Project | null>(null);
const mutationError = ref('');
const form = reactive<ProjectInput>({
  name: '',
  description: '',
  status: 'active',
});
const projects = computed(() => projectsQuery.data.value?.list ?? []);
const filteredProjects = computed(() =>
  statusFilter.value
    ? projects.value.filter((project) => project.status === statusFilter.value)
    : projects.value,
);
const dialogTitle = computed(() =>
  dialogMode.value === 'create'
    ? t('common.workspace.createTitle')
    : (selectedProject.value?.name ?? t('common.workspace.title')),
);
const refresh = () => queryClient.invalidateQueries({ queryKey: ['projects'] });
const showError = (error: unknown) => {
  mutationError.value = isApiError(error)
    ? error.message
    : t('common.workspace.unknownError');
};
const saveMutation = useMutation({
  mutationFn: ({
    id,
    input,
  }: {
    id?: number;
    input: ProjectInput | ProjectUpdateInput;
  }) => (id ? updateProject(id, input) : createProject(input as ProjectInput)),
  onSuccess: async () => {
    await refresh();
    closeDialog();
  },
  onError: showError,
});
const deleteMutation = useMutation({
  mutationFn: deleteProject,
  onSuccess: refresh,
  onError: showError,
});
const resetForm = (project?: Project) =>
  Object.assign(
    form,
    project
      ? {
          name: project.name,
          description: project.description,
          status: project.status,
        }
      : { name: '', description: '', status: 'active' },
  );
const openCreate = () => {
  selectedProject.value = null;
  mutationError.value = '';
  resetForm();
  dialogMode.value = 'create';
};
const openDetails = (project: Project) => {
  selectedProject.value = project;
  mutationError.value = '';
  dialogMode.value = 'view';
};
const openEdit = (project: Project) => {
  selectedProject.value = project;
  mutationError.value = '';
  resetForm(project);
  dialogMode.value = 'edit';
};
const closeDialog = () => {
  dialogMode.value = null;
  selectedProject.value = null;
};
const saveProject = () => {
  mutationError.value = '';
  saveMutation.mutate({
    id: selectedProject.value?.id,
    input: {
      name: form.name,
      description: form.description,
      status: form.status,
    },
  });
};
const removeProject = (project: Project) => {
  mutationError.value = '';
  // 跨 UI 框架的简单删除确认，使用原生 confirm 避免引入框架耦合
  if (
    // oxlint-disable-next-line no-alert
    window.confirm(t('common.workspace.deleteConfirm', { name: project.name }))
  )
    deleteMutation.mutate(project.id);
};
const formatDate = (value: string) =>
  new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(
    new Date(value),
  );
</script>

<style scoped lang="scss">
.page-header > button {
  flex: 0 0 auto;
}

.workspace-toolbar {
  display: flex;
  gap: var(--space-3);
  align-items: end;
  justify-content: space-between;
  padding: var(--space-4) 0;
}

.workspace-toolbar label {
  display: grid;
  gap: var(--space-1);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.workspace-toolbar select {
  min-height: 2.5rem;
  padding: 0 var(--space-3);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.workspace-list {
  border-top: 1px solid var(--color-border);
}

.workspace-list > article {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.project-main {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
  padding: 0;
  color: var(--color-text);
  text-align: left;
  background: transparent;
  border: 0;
}

.project-main b {
  font-size: var(--text-card-title);
}

.project-main p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-height: 1.45;
  color: var(--color-text-secondary);
  -webkit-box-orient: vertical;
}

.project-main small {
  color: var(--color-text-muted);
}

.status {
  justify-self: start;
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
}

.status--active {
  color: var(--color-success);
}

.status--paused {
  color: var(--color-warning);
}

.row-actions {
  display: flex;
  gap: var(--space-1);
}

.row-actions button {
  min-height: 2.25rem;
  padding: 0 var(--space-2);
  color: var(--color-text-secondary);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
}

.row-actions button:hover {
  background: var(--color-background-soft);
}

.row-actions button.danger,
.operation-error {
  color: var(--color-danger);
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: end center;
  padding-top: env(safe-area-inset-top);
  background: var(--color-overlay);
}

.workspace-dialog {
  width: min(100%, 36rem);
  max-height: 90dvh;
  padding: var(--space-5);
  overflow: auto;
  background: var(--color-surface);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--shadow-dialog);
}

.workspace-dialog > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.workspace-dialog > header small {
  color: var(--color-text-secondary);
}

.workspace-dialog > header h2 {
  margin: var(--space-1) 0 0;
  font-size: var(--text-section-title);
}

.workspace-dialog > header button {
  width: var(--touch-target);
  min-height: var(--touch-target);
  font-size: 1.5rem;
  background: transparent;
  border: 0;
}

.workspace-dialog form {
  display: grid;
  gap: var(--space-4);
  padding-top: var(--space-4);
}

.workspace-dialog form label {
  display: grid;
  gap: var(--space-2);
  font-size: var(--text-secondary);
  font-weight: 600;
}

.workspace-dialog input,
.workspace-dialog textarea,
.workspace-dialog select {
  width: 100%;
  min-height: var(--touch-target);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
}

.workspace-dialog footer {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  padding-top: var(--space-4);
}

.project-details {
  margin: 0;
}

.project-details div {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.project-details dt {
  color: var(--color-text-secondary);
}

.project-details dd {
  margin: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 620px) {
  .page-header {
    align-items: stretch;
  }

  .page-header > button {
    align-self: end;
  }

  .workspace-list > article {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  .row-actions {
    justify-content: flex-end;
  }
}

@media (min-width: 768px) {
  .dialog-overlay {
    place-items: center;
    padding: var(--space-6);
  }

  .workspace-dialog {
    border-radius: var(--radius-lg);
  }
}
</style>
