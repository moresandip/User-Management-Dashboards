import { describe, it, expect } from 'vitest';
import { validateForm } from '../src/utils/validators';

describe('Form Validation Engine Tests', () => {
  it('should flag empty names, email, and department', () => {
    const data = { firstName: '', lastName: '', email: '', department: '' };
    const errors = validateForm(data);
    expect(errors.firstName).toBe("First Name is required");
    expect(errors.lastName).toBe("Last Name is required");
    expect(errors.email).toBe("Email is required");
    expect(errors.department).toBe("Department is required");
  });

  it('should flag short names', () => {
    const data = { firstName: 'A', lastName: 'B', email: 'valid@test.com', department: 'IT' };
    const errors = validateForm(data);
    expect(errors.firstName).toBe("First Name must be at least 2 characters");
    expect(errors.lastName).toBe("Last Name must be at least 2 characters");
  });

  it('should flag invalid email formats', () => {
    const invalidEmails = ['plain', 'no-domain@', 'no-tld@domain', '@domain.com', 'spaces @domain.com'];
    invalidEmails.forEach(email => {
      const data = { firstName: 'Leanne', lastName: 'Graham', email, department: 'IT' };
      const errors = validateForm(data);
      expect(errors.email).toBe("Invalid email address format");
    });
  });

  it('should flag invalid departments', () => {
    const data = { firstName: 'Leanne', lastName: 'Graham', email: 'test@email.com', department: 'Astronomy' };
    const errors = validateForm(data);
    expect(errors.department).toBe("Selected department is invalid");
  });

  it('should validate complete valid inputs with zero errors', () => {
    const data = { firstName: 'Leanne', lastName: 'Graham', email: 'test@email.com', department: 'Engineering' };
    const errors = validateForm(data);
    expect(Object.keys(errors).length).toBe(0);
  });
});
