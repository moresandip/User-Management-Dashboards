import { DEPARTMENTS } from './constants';

/**
 * Validates the user form data.
 * @param {{ firstName: string, lastName: string, email: string, department: string }} formData 
 * @returns {Record<string, string>} An object containing validation error messages, or empty if valid.
 */
export const validateForm = (formData) => {
  const errors = {};

  // First Name validation
  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = "First Name is required";
  } else if (formData.firstName.trim().length < 2) {
    errors.firstName = "First Name must be at least 2 characters";
  }

  // Last Name validation
  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = "Last Name is required";
  } else if (formData.lastName.trim().length < 2) {
    errors.lastName = "Last Name must be at least 2 characters";
  }

  // Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Invalid email address format";
    }
  }

  // Department validation
  if (!formData.department || !formData.department.trim()) {
    errors.department = "Department is required";
  } else if (!DEPARTMENTS.includes(formData.department)) {
    errors.department = "Selected department is invalid";
  }

  return errors;
};
