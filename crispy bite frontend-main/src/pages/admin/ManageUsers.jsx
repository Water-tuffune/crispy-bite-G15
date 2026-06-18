import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import { adminService } from "../../services/adminService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await adminService.users();
    setUsers(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (user) => {
    const next = user.status === "active" ? "inactive" : "active";
    await adminService.updateUserStatus(user.id, next);
    setMessage("User status updated.");
    load();
  };

  return (
    <>
      <h1>Manage Users</h1>
      <AlertMessage type="success" message={message} />
      <div className="table-responsive dashboard-card">
        <table className="table align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td><button className="btn btn-outline-dark btn-sm" onClick={() => toggleStatus(user)}>{user.status === "active" ? "Deactivate" : "Activate"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageUsers;
