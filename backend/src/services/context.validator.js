/**
 * Context Validator
 * SOLE SOURCE OF TRUTH for permissions, userRole, and accountTier.
 * Frontend-provided values are treated as untrusted hints.
 */

import { getUserById } from '../db/user.repository.js';

/**
 * Sanitize recent actions to prevent prompt injection
 */
function sanitizeRecentActions(actions) {
  if (!Array.isArray(actions)) return [];
  
  return actions
    .slice(0, 5) // Max 5 actions
    .map(action => {
      if (typeof action !== 'string') return '';
      // Remove special characters that could be used for injection
      return action
        .replace(/[<>{}[\]\\]/g, '')
        .replace(/\n|\r/g, ' ')
        .substring(0, 100); // Max 100 chars per action
    })
    .filter(Boolean);
}

/**
 * Sanitize page/module identifiers
 */
function sanitizePath(path) {
  if (typeof path !== 'string') return '/';
  return path
    .replace(/[<>{}[\]\\]/g, '')
    .replace(/\n|\r/g, '')
    .substring(0, 200);
}

/**
 * Derive permissions from user role
 */
function derivePermissions(role) {
  const permissionsByRole = {
    admin: ['create_project', 'delete_project', 'view_analytics', 'manage_users', 'export_data', 'access_templates'],
    user: ['create_project', 'view_analytics', 'export_data', 'access_templates'],
    viewer: ['view_analytics', 'access_templates'],
  };
  return permissionsByRole[role] || permissionsByRole.viewer;
}

/**
 * Validate and re-derive context from server-side data
 * @param {string} userId - The authenticated user ID
 * @param {Object} frontendContext - Untrusted frontend context
 * @returns {Promise<Object>} - Validated context
 */
export async function validateContext(userId, frontendContext = {}) {
  // Get authoritative user data from database
  let user = null;
  try {
    if (userId) {
      user = await getUserById(userId);
    }
  } catch (e) {
    console.warn('Failed to fetch user for context validation:', e.message);
  }

  // Server-derived values (AUTHORITATIVE)
  const userRole = user?.role || 'viewer';
  const accountTier = user?.account_tier || 'free';
  const permissions = derivePermissions(userRole);

  // Sanitized frontend values (hints only)
  const page = sanitizePath(frontendContext.page || '/');
  const module = sanitizePath(frontendContext.module || 'general');
  const recentActions = sanitizeRecentActions(frontendContext.recentActions);

  return {
    page,
    module,
    userRole,        // Server-derived
    permissions,     // Server-derived
    accountTier,     // Server-derived
    recentActions,   // Sanitized
  };
}

export default { validateContext };
