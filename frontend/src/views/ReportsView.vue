<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-center mb-6 text-primary">Task Reports & Analytics</h1>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 mb-6" elevation="8" color="surface">
          <v-card-title class="text-h6">Completion Rate Over Time</v-card-title>
          <v-card-text>
            <LineChart :chart-data="completionRateChartData" :chart-options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 mb-6" elevation="8" color="surface">
          <v-card-title class="text-h6">Todos by Creation Month</v-card-title>
          <v-card-text>
            <BarChart :chart-data="todosByMonthChartData" :chart-options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="glass-card pa-4" elevation="8" color="surface">
          <v-card-title class="text-h6">All Todos Data Grid</v-card-title>
          <v-card-text>
            <v-progress-linear
              v-if="todoStore.loading"
              indeterminate
              color="primary"
              class="mb-4"
            ></v-progress-linear>
            <v-data-table
              v-if="!todoStore.loading && todoStore.todos.length > 0"
              :headers="allTodoHeaders"
              :items="todoStore.todos"
              item-value="_id"
              class="elevation-1"
              :items-per-page="10"
            >
              <template v-slot:item.completed="{ item }">
                <v-icon :color="item.raw.completed ? 'success' : 'warning'">
                  {{ item.raw.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
              </template>
              <template v-slot:item.dueDate="{ item }">
                {{ item.raw.dueDate ? new Date(item.raw.dueDate).toLocaleDateString() : 'N/A' }}
              </template>
              <template v-slot:item.createdAt="{ item }">
                {{ new Date(item.raw.createdAt).toLocaleDateString() }}
              </template>
              <template v-slot:no-data>
                <v-alert type="info" class="mt-4">No todos to display in the report.</v-alert>
              </template>
            </v-data-table>
            <v-card v-else-if="!todoStore.loading && todoStore.todos.length === 0" class="pa-6 text-center glass-card" color="surface">
              <v-icon size="64" color="grey-lighten-1">mdi-chart-bar</v-icon>
              <p class="text-h6 mt-4 text-grey-darken-1">No task data available for reports.</p>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todo';
import BarChart from '@/components/Charts/BarChart.vue';
import LineChart from '@/components/Charts/LineChart.vue';
import { useTheme } from 'vuetify'; // Import useTheme to get current theme colors

const todoStore = useTodoStore();
const theme = useTheme(); // Get the current theme instance

const allTodoHeaders = [
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Completed', key: 'completed' },
  { title: 'Due Date', key: 'dueDate' },
  { title: 'Created At', key: 'createdAt' },
];

const completionRateChartData = computed(() => {
  const sortedTodos = [...todoStore.todos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const labels = [];
  const data = [];
  let completedCount = 0;
  let totalCount = 0;

  sortedTodos.forEach(todo => {
    totalCount++;
    if (todo.completed) {
      completedCount++;
    }
    const dateLabel = new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!labels.includes(dateLabel)) {
      labels.push(dateLabel);
      data.push((completedCount / totalCount) * 100);
    } else {
      data[labels.indexOf(dateLabel)] = (completedCount / totalCount) * 100;
    }
  });

  return {
    labels: labels,
    datasets: [
      {
        label: 'Completion Rate (%)',
        backgroundColor: theme.current.value.colors.success + '20', // Success color with transparency
        borderColor: theme.current.value.colors.success,
        data: data,
        fill: true,
        tension: 0.3
      }
    ]
  };
});

const todosByMonthChartData = computed(() => {
  const monthCounts = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  todoStore.todos.forEach(todo => {
    const date = new Date(todo.createdAt);
    const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
  });

  const labels = Object.keys(monthCounts).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    return dateA - dateB;
  });
  const data = labels.map(label => monthCounts[label]);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Number of Todos Created',
        backgroundColor: theme.current.value.colors.secondary, // Light Green
        data: data
      }
    ]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: theme.current.value.colors['on-surface']
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: theme.current.value.colors['on-surface']
      },
      grid: {
        color: theme.current.value.colors['on-background'] + '10'
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: theme.current.value.colors['on-surface'],
        precision: 0
      },
      grid: {
        color: theme.current.value.colors['on-background'] + '10'
      }
    }
  }
}));

onMounted(() => {
  todoStore.fetchTodos();
});
</script>

<style scoped>
.v-container {
  /* Background color is now managed by Vuetify theme */
  min-height: calc(100vh - 64px - 64px);
}
/* Glass card styles are now handled globally in main.css and via Vuetify props */
</style>