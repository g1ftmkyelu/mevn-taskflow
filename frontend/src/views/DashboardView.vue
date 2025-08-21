<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-center mb-6 text-primary">Dashboard Overview</h1>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 mb-6" elevation="8" color="surface">
          <v-card-title class="text-h6">Todo Status</v-card-title>
          <v-card-text>
            <BarChart :chart-data="todoStatusChartData" :chart-options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 mb-6" elevation="8" color="surface">
          <v-card-title class="text-h6">Todos by Due Date (Next 30 Days)</v-card-title>
          <v-card-text>
            <LineChart :chart-data="todosByDueDateChartData" :chart-options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="glass-card pa-4" elevation="8" color="surface">
          <v-card-title class="text-h6">Recent Todos</v-card-title>
          <v-card-text>
            <v-progress-linear
              v-if="todoStore.loading"
              indeterminate
              color="primary"
              class="mb-4"
            ></v-progress-linear>
            <v-data-table
              v-if="!todoStore.loading && recentTodos.length > 0"
              :headers="recentTodoHeaders"
              :items="recentTodos"
              item-value="_id"
              class="elevation-1"
              :items-per-page="5"
            >
              <template v-slot:item.completed="{ item }">
                <v-icon :color="item.raw.completed ? 'success' : 'warning'">
                  {{ item.raw.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
              </template>
              <template v-slot:item.dueDate="{ item }">
                {{ item.raw.dueDate ? new Date(item.raw.dueDate).toLocaleDateString() : 'N/A' }}
              </template>
              <template v-slot:no-data>
                <v-alert type="info" class="mt-4">No recent todos to display.</v-alert>
              </template>
            </v-data-table>
            <v-card v-else-if="!todoStore.loading && recentTodos.length === 0" class="pa-6 text-center glass-card" color="surface">
              <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
              <p class="text-h6 mt-4 text-grey-darken-1">No recent tasks found. Add some todos!</p>
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

const recentTodoHeaders = [
  { title: 'Title', key: 'title' },
  { title: 'Completed', key: 'completed' },
  { title: 'Due Date', key: 'dueDate' },
];

const recentTodos = computed(() => {
  return [...todoStore.todos]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); // Show up to 5 most recent todos
});

const todoStatusChartData = computed(() => {
  const completedCount = todoStore.todos.filter(todo => todo.completed).length;
  const pendingCount = todoStore.todos.length - completedCount;

  return {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Number of Todos',
        backgroundColor: [theme.current.value.colors.success, theme.current.value.colors.warning], // Use theme colors
        data: [completedCount, pendingCount]
      }
    ]
  };
});

const todosByDueDateChartData = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);
  thirtyDaysLater.setHours(23, 59, 59, 999);

  const todosInNext30Days = todoStore.todos.filter(todo =>
    todo.dueDate && new Date(todo.dueDate) >= today && new Date(todo.dueDate) <= thirtyDaysLater && !todo.completed
  );

  const dateCounts = {};
  todosInNext30Days.forEach(todo => {
    const dateStr = new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });

  const labels = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));
  const data = labels.map(label => dateCounts[label]);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Pending Todos',
        backgroundColor: theme.current.value.colors.info, // Use theme color
        borderColor: theme.current.value.colors.info,
        data: data,
        fill: false,
        tension: 0.1
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
        color: theme.current.value.colors['on-surface'] // Use on-surface color for legend text
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
        color: theme.current.value.colors['on-surface'] // Use on-surface color for ticks
      },
      grid: {
        color: theme.current.value.colors['on-background'] + '10' // Lighter grid lines
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: theme.current.value.colors['on-surface'], // Use on-surface color for ticks
        precision: 0
      },
      grid: {
        color: theme.current.value.colors['on-background'] + '10' // Lighter grid lines
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