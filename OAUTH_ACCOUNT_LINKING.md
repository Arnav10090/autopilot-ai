# OAuth Account Linking Fix

## Problem

When a user signed in with Google using an email (e.g., `user@example.com`), then tried to sign in with GitHub using the same email, the application threw an error:

```
error: duplicate key value violates unique constraint "users_email_key"
```

This happened because both OAuth providers were trying to create separate user accounts with the same email address.

## Solution

### Database Schema Changes

**Before**: Stored OAuth information directly in the `users` table
```sql
users (
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  UNIQUE(oauth_provider, oauth_id)
)
```

**After**: Created separate `oauth_accounts` table to support multiple OAuth providers per user
```sql
users (
  -- removed oauth_provider and oauth_id
)

oauth_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  provider VARCHAR(50),
  provider_user_id VARCHAR(255),
  UNIQUE(provider, provider_user_id)
)
```

### Account Linking Logic

The `createOAuthUser()` function now:

1. **Checks if user exists** by email first
2. **If user exists**:
   - Links the new OAuth provider to the existing user account
   - Creates entry in `oauth_accounts` table
   - Returns the existing user
3. **If user doesn't exist**:
   - Creates new user in `users` table
   - Creates OAuth account entry in `oauth_accounts` table

### Benefits

✅ **Multiple OAuth providers**: Users can now sign in with both Google AND GitHub using the same email  
✅ **No duplicates**: No more duplicate key constraint errors  
✅ **Account unification**: All OAuth methods linked to one user account  
✅ **Flexible**: Easy to add more OAuth providers in the future  

## Testing

After the fix, you should now be able to:

1. Sign in with Google using `user@example.com` → Creates user account
2. Sign in with GitHub using `user@example.com` → Links to same user account
3. Future sign-ins with either provider → Both work seamlessly

Check the database:
```sql
-- View users
SELECT * FROM users;

-- View OAuth accounts linked to each user
SELECT u.email, oa.provider, oa.provider_user_id 
FROM users u 
JOIN oauth_accounts oa ON u.id = oa.user_id;
```

You should see one user with multiple entries in `oauth_accounts` for different providers.

## Migration Note

The database was reinitialized with the new schema. Any existing users were deleted. In production, you would create a migration script to:
1. Create `oauth_accounts` table
2. Migrate existing `oauth_provider` and `oauth_id` data to `oauth_accounts`
3. Remove columns from `users` table
