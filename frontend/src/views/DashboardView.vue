<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-center mb-6 text-primary">Dashboard Overview</h1>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 mb-6" elevation="8">
          <v-card-title class="text-h6">Todo Status</v-card-title>
          <v-card-text>
            <BarChart :chart-data="todoStatusChartData" :chart-options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="glass-card pa-4 mb-6" elevation="8">
          <v-card-title class="text-h6">Todos by Due Date (Next 30 Days)</v-card-title>
          <v-card-text>
            <LineChart :chart-data="todosByDueDateChartData" :chart-options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="glass-card pa-4" elevation="8">
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
            <v-card v-else-if="!todoStore.loading && recentTodos.length === 0" class="pa-6 text-center glass-card">
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
import { ref, computed } from 'vue';
import { useTodoStore } from '@/stores/todo';
import BarChart from '@/components/Charts/BarChart.vue';
import LineChart from '@/components/Charts/LineChart.vue';

const todoStore = useTodoStore();

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
        backgroundColor: ['#388E3C', '#FBC02D'], // Success, Warning
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
        backgroundColor: '#1976D2', // Info color
        borderColor: '#1976D2',
        data: data,
        fill: false,
        tension: 0.1
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#424242' // Dark grey for legend text
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
        color: '#424242'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#424242',
        precision: 0
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  }
};
</script>

<style scoped>
.v-container {
  background-color: #F1F8E9;
  min-height: calc(100vh - 64px - 64px);
}
.glass-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(224, 224, 224, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}
</style>