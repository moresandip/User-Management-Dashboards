import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userService';
import { splitFullName, getDepartmentForId } from '../utils/helpers';

/**
 * Custom hook to manage user states and sync with JSONPlaceholder mock API.
 */
export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Trigger transient success message
  const triggerSuccess = useCallback((message) => {
    setSuccessMessage(message);
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      const mappedUsers = response.data.map(user => {
        const { firstName, lastName } = splitFullName(user.name);
        return {
          id: user.id,
          firstName,
          lastName,
          email: user.email || '',
          department: getDepartmentForId(user.id)
        };
      });
      setUsers(mappedUsers);
    } catch (err) {
      setError("Unable to fetch active users from the database. Please verify your connection status and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (formData) => {
    setError(null);
    setIsLoading(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        department: formData.department
      };
      
      const response = await createUser(payload);
      
      // JSONPlaceholder simulated ID is 11. To prevent duplicates in UI if adding multiple users,
      // let's compute a unique ID on the client side.
      const clientCalculatedId = users.length > 0 
        ? Math.max(...users.map(u => u.id)) + 1 
        : 11;
        
      const createdUser = {
        id: response.data.id && response.data.id !== 11 ? response.data.id : clientCalculatedId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department
      };

      setUsers(prevUsers => [createdUser, ...prevUsers]);
      triggerSuccess(`User "${createdUser.firstName} ${createdUser.lastName}" added successfully!`);
      return true;
    } catch (err) {
      setError("Failed to create the new user. Please check your network connection.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const editUser = async (id, formData) => {
    setError(null);
    setIsLoading(true);
    try {
      const payload = {
        id,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        department: formData.department
      };

      // Simulated PUT request to JSONPlaceholder
      await updateUser(id, payload);

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id 
            ? { ...user, ...formData } 
            : user
        )
      );

      triggerSuccess(`User "${formData.firstName} ${formData.lastName}" updated successfully!`);
      return true;
    } catch (err) {
      // JSONPlaceholder has a known limitation: if we try to PUT/DELETE an ID created by the client (e.g. ID > 10),
      // it returns 500 or 404 because the server doesn't know about it. 
      // We will handle this error gracefully by updating local state anyway and displaying a success message,
      // explaining this behavior as a standard engineering constraint of fake APIs.
      if (id > 10) {
        // ID > 10 is locally generated, mock server fails, but we proceed for local client demo
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === id 
              ? { ...user, ...formData } 
              : user
          )
        );
        triggerSuccess(`User "${formData.firstName} ${formData.lastName}" updated locally (Mock server skipped for client-added ID).`);
        return true;
      }
      setError("Failed to update user details. Please verify your connection.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeUser = async (id) => {
    setError(null);
    setIsLoading(true);
    try {
      // Simulated DELETE request
      await deleteUser(id);
      
      const targetUser = users.find(u => u.id === id);
      const nameStr = targetUser ? `"${targetUser.firstName} ${targetUser.lastName}"` : "User";
      
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      triggerSuccess(`${nameStr} deleted successfully!`);
      return true;
    } catch (err) {
      // Handle the same JSONPlaceholder restriction for client-created IDs
      if (id > 10) {
        const targetUser = users.find(u => u.id === id);
        const nameStr = targetUser ? `"${targetUser.firstName} ${targetUser.lastName}"` : "User";
        
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        triggerSuccess(`${nameStr} deleted locally (Mock server skipped for client-added ID).`);
        return true;
      }
      setError("Failed to delete the user. Please check your network connection.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    successMessage,
    setError,
    setSuccessMessage,
    fetchUsers,
    addUser,
    editUser,
    removeUser
  };
}
