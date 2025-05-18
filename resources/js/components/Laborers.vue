<template>
  <div class="laborers-container">
    <div class="header-section">
      <h2>Laborer Management</h2>
      <button class="add-button" @click="openAddModal">
        <i class="fas fa-plus"></i> Add Laborer
      </button>
    </div>

    <!-- Laborers Table -->
    <div class="card-container">
      <div class="table-responsive" v-if="laborers.length > 0">
        <table class="laborers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="laborer in laborers" :key="laborer.id">
              <td class="font-medium">{{ laborer.name }}</td>
              <td class="text-gray">{{ laborer.address }}</td>
              <td class="actions text-right">
                <button class="icon-btn edit-btn" @click="editLaborer(laborer)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn delete-btn" @click="deleteLaborer(laborer.id)" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-content">
          <i class="fas fa-users-slash"></i>
          <h3>No Laborers Added</h3>
          <p>Get started by adding your first laborer</p>
          <button class="add-button" @click="openAddModal">
            <i class="fas fa-plus"></i> Add Laborer
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal-overlay" v-if="showAddModal" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Laborer' : 'Add New Laborer' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Name</label>
            <input type="text" v-model="currentLaborer.name" placeholder="Laborer's full name">
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="currentLaborer.address" placeholder="Complete address"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">Cancel</button>
          <button class="btn primary" @click="saveLaborer">
            {{ isEditing ? 'Update' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const laborers = ref([]);
    const showAddModal = ref(false);
    const isEditing = ref(false);
    const currentLaborer = ref({
      id: null,
      name: '',
      address: ''
    });

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const openAddModal = () => {
      currentLaborer.value = { id: null, name: '', address: '' };
      isEditing.value = false;
      showAddModal.value = true;
    };

    const editLaborer = (laborer) => {
      currentLaborer.value = { ...laborer };
      isEditing.value = true;
      showAddModal.value = true;
    };

    const deleteLaborer = (id) => {
      if (confirm('Are you sure you want to delete this laborer?')) {
        laborers.value = laborers.value.filter(l => l.id !== id);
      }
    };

    const saveLaborer = () => {
      if (!currentLaborer.value.name.trim()) {
        alert('Please enter laborer name');
        return;
      }

      if (isEditing.value) {
        const index = laborers.value.findIndex(l => l.id === currentLaborer.value.id);
        if (index !== -1) {
          laborers.value[index] = { ...currentLaborer.value };
        }
      } else {
        currentLaborer.value.id = generateId();
        laborers.value.push({ ...currentLaborer.value });
      }
      closeModal();
    };

    const closeModal = () => {
      showAddModal.value = false;
    };

    return {
      laborers,
      showAddModal,
      isEditing,
      currentLaborer,
      openAddModal,
      editLaborer,
      deleteLaborer,
      saveLaborer,
      closeModal
    };
  }
};
</script>

<style scoped>
/* Main Container */
.laborers-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-section h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

/* Card Container */
.card-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Table Styles */
.table-responsive {
  overflow-x: auto;
}

.laborers-table {
  width: 100%;
  border-collapse: collapse;
}

.laborers-table th,
.laborers-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.laborers-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.laborers-table tr:hover td {
  background-color: #f9fafb;
}

.font-medium {
  font-weight: 500;
}

.text-gray {
  color: #64748b;
}

.text-right {
  text-align: right;
}

/* Action Buttons */
.actions {
  white-space: nowrap;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  margin-left: 8px;
  border-radius: 4px;
  color: #64748b;
  transition: all 0.2s;
}

.icon-btn:hover {
  background-color: #f1f5f9;
}

.edit-btn:hover {
  color: #3b82f6;
}

.delete-btn:hover {
  color: #ef4444;
}

/* Empty State */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-state i {
  font-size: 3rem;
  color: #e2e8f0;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #334155;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 20px;
}

/* Add Button */
.add-button {
  background-color: #16a085;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #138a72;
}

.add-button i {
  font-size: 0.9rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
}

.close-btn:hover {
  color: #64748b;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #334155;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #16a085;
  box-shadow: 0 0 0 2px rgba(22, 160, 133, 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn.secondary {
  background: #000000;
  border: 1px solid #000000;
  color: #334155;
}

.btn.secondary:hover {
  background: #f1f5f9;
}

.btn.primary {
  background: #16a085;
  color: white;
  border: none;
}

.btn.primary:hover {
  background: #138a72;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .laborers-table th,
  .laborers-table td {
    padding: 12px 15px;
  }

  .modal {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .laborers-table th,
  .laborers-table td {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>