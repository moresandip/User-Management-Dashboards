import { DEPARTMENTS } from './constants';

/**
 * Splits a full name string by the first space into firstName and lastName.
 * E.g., "Leanne Graham" -> { firstName: "Leanne", lastName: "Graham" }
 * E.g., "Mrs. Dennis Schulist" -> { firstName: "Mrs.", lastName: "Dennis Schulist" }
 * @param {string} fullName 
 * @returns {{ firstName: string, lastName: string }}
 */
export const splitFullName = (fullName = '') => {
  if (!fullName) return { firstName: '', lastName: '' };
  
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(' ');
  
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }
  
  const firstName = trimmed.substring(0, spaceIndex);
  const lastName = trimmed.substring(spaceIndex + 1).trim();
  
  return { firstName, lastName };
};

/**
 * Assigns a deterministic department based on the user's ID.
 * @param {number} id 
 * @returns {string}
 */
export const getDepartmentForId = (id) => {
  if (!id || typeof id !== 'number') return DEPARTMENTS[0];
  return DEPARTMENTS[(id - 1) % DEPARTMENTS.length];
};
