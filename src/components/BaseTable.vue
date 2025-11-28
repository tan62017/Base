<script lang="ts" setup>
import { ref, defineProps, computed } from 'vue';
import { formatNumberWithCommas } from '@/utils';

interface PropsType {
  data: Record<string, any>[];
  columns: Array<{
    label: string;
    prop: string;
    sortType?: string | undefined;
    headerAlign?: string | undefined;
    textAlign?: string | undefined;
  }>;
  page?: {
    currentPage: number;
    pageSize: number;
    total: number;
    pageCount: number;
    layout?: string | undefined;
  };
  loading?: boolean;
  autoScroll?: boolean;
  // ui 风格，有需要其他样式添加对应class
  uiClass?: string
}

const props = withDefaults(defineProps<PropsType>(), {
  loading: false,
  autoScroll: false,
  uiClass: ''
});

const emits = defineEmits(['update:page', 'rowClick', 'cellDbClick']);

const tableData = ref(props.data);

// 自定义排序方法
function handleSortMethods({ prop, order }: { prop: string; order: string }) {
  const sorted = [...tableData.value];
  if (order === 'ascending') {
    sorted.sort((a, b) => Number(a[prop]) - Number(b[prop]));
  }
  if (order === 'descending') {
    sorted.sort((a, b) => Number(b[prop]) - Number(a[prop]));
  }
  tableData.value = sorted;
}

const showPagination = computed(() => {
  if (!props.page) return false;
  const { currentPage, pageSize, total, pageCount } = props.page;
  return (
    typeof currentPage == 'number' &&
    typeof pageSize == 'number' &&
    (typeof total == 'number' || typeof pageCount == 'number')
  );
});

function rowClick(data: any) {
  // console.log(...args);
  emits('rowClick', data);
}

function cellDbClick(data: any) {
  emits('cellDbClick', data);
}

function currentPageChange(val: Number) {
  emits('update:page', { ...props.page, currentPage: val });
}

function pageSizeChange(val: Number) {
  emits('update:page', { ...props.page, currentPage: 1, pageSize: val });
}
</script>

<template>
  <el-table class="agel-table" :data="tableData" style="width: 100%" @sort-change="handleSortMethods"
    @row-click="rowClick" @cell-dblclick="cellDbClick" v-bind="$attrs">
    <el-table-column label="排行" width="80">
      <template #default="{ row, $index }">
        <slot name="rank">
          <span :class="[$index < 3 ? 'sort' + $index : '', 'sort']">
            {{ $index + 1 }}
          </span>
        </slot>
      </template>
    </el-table-column>

    <el-table-column v-for="(col, index) in columns" :key="index" :label="col.label" :prop="col.prop"
      :sortable="col.sortType" :header-align="col.headerAlign" :align="col.textAlign">
      <template #default="{ row }">
        <slot :name="col.prop || ''" :data="{ value: row[col.prop], data: row }">
          <div>
            {{ Number(row[col.prop]) ? formatNumberWithCommas(row[col.prop]) : row[col.prop] }}
          </div>
        </slot>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-if="showPagination" :disabled="loading" v-bind="{ ...page }" background
    @update:current-page="currentPageChange" @update:page-size="pageSizeChange">
    <template #total="scope"> 共 {{ scope.total }} 条 </template>
  </el-pagination>
</template>

<style lang="scss" scoped>
.agel-table {
  --el-table-bg-color: var(--table-bg);
  --el-table-border-color: var(--table-border-color);

  :deep(.el-table__inner-wrapper) {
    --el-fill-color-lighter: var(--table-bg);

    tr {
      background-color: transparent;
    }

    th.el-table__cell {
      --el-table-header-bg-color: transparent !important;

    }

    thead {
      color: var(--table-thead-color) !important;
      background-color: var(--table-thead-bg) !important;
    }

    tbody {
      .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
        background-color: var(--table-tbody-tr-hover-color) !important;
      }

      tr {
        color: var(--table-tbody-color);

        &:hover>td.el-table__cell {
          background-color: var(--table-tbody-tr-hover-color) !important;
        }
      }
    }

  }

}

.el-pagination {
  margin-top: 10px;
}
</style>
