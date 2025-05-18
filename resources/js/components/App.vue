<template>
  <div class="app-container">
    <!-- Fixed Header -->
    <header class="header">
      <h1>Farm Operation Management</h1>
    </header>
    
    <div class="main-content">
      <!-- Fixed Sidebar -->
      <Sidebar />
      
      <!-- Scrollable Content Area -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';

export default {
  components: { Sidebar }
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 0 1rem;
  text-align: center;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  height: 36px; /* Smaller header height */
  font-size: 16px; /* Adjusted text size to fit the smaller header */
  line-height: 36px; /* Vertically center the text */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}


.main-content {
  display: flex;
  flex: 1;
  margin-top: 36px; /* Match new header height */
}

.content {
  flex: 1;
  padding: 2rem;
  margin-left: 250px;
  height: calc(100vh - 36px); /* Adjust content height */
  overflow-y: auto;
  background-color: #f5f7fa;
}

</style>