<template>
  <nav class="sidebar">
    <ul>
      <li v-for="item in menuItems" :key="item.route">
        <router-link :to="{ name: item.route }" active-class="active">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { name: 'Dashboard', route: 'dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Planting', route: 'planting-management', icon: 'fas fa-seedling' },
        { name: 'Tasks', route: 'task-management', icon: 'fas fa-tasks' },
        { name: 'Harvest', route: 'harvest', icon: 'fas fa-tractor' },
        { name: 'Sales', route: 'sales', icon: 'fas fa-chart-line' },
        { name: 'Inventory', route: 'inventory', icon: 'fas fa-boxes' },
        { name: 'Expenses', route: 'expenses', icon: 'fas fa-receipt' },
        { name: 'Orders', route: 'orders', icon: 'fas fa-clipboard-list' },
        { name: 'Laborers', route: 'laborers', icon: 'fas fa-users' },
        { name: 'Weather', route: 'weather-forecast', icon: 'fas fa-cloud-sun' }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #34495e;
  color: white;
  position: fixed;
  top: 36px; /* Match new header height */
  left: 0;
  height: calc(100vh - 36px);
  overflow-y: auto;
  z-index: 999;
}


.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar a {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  gap: 10px;
}

.sidebar a:hover {
  background-color: #2c3e50;
}

.sidebar .active {
  background-color: #16a085;
  font-weight: bold;
}

.sidebar i {
  width: 20px;
  text-align: center;
}
</style>