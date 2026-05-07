// src/pages/admin/UserManagementView.jsx
export default function UserManagementView() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600">Add, edit, or remove staff/admin accounts</p>
      </div>
      <div className="bg-white p-6 rounded shadow text-gray-500">
        User list with CRUD operations.
      </div>
    </div>
  );
}