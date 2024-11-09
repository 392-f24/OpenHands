# OpenHands - Red Team

> COMP_SCI 392 - Fall 2024 - Northwestern University

## Table of Contents

1. [File Structure and Logic](#1-file-structure-and-logic)
2. [Keeping Up-to-Date with `origin/main`](#2-keeping-your-work-up-to-date-with-originmain)
3. [Typescript](#3-typescript)
   - [Global Types](#1-global-types-in-typesdts)
   - [Local Types](#2-local-types-definition)
   - [Interfaces and props](#3-interfaces-and-props)
   - [`import type` Instead of `import`](#4-import-type-instead-of-import)
4. [Context](#4-context)
   - [What is Context?](#1-what-is-context)
   - [Why Use Context Instead of Hooks?](#2-why-use-context-instead-of-hooks)
   - [How to Use UserContext](#3-how-to-use-usercontext)
     - [Accessing User Data](#accessing-user-data)
     - [Updating User Data](#updating-user-data)

## 1. File Structure and Logic

This project uses a component-based structure with a focus on clear separation of concerns. Key files and folders:

```plaintext
.
├── LICENSE
├── README.md                  # Project documentation and usage guide
├── prettier.config.cjs        # Prettier configuration file
├── eslint.config.mjs          # Eslint configuration file
├── vite.config.ts             # Vite configuration file
├── tsconfig.json              # Typescript config file
├── firebase.json              # Firebase configuration for hosting
├── package.json               # Dependencies
└── src                        # Source code
    ├── components             # Shared components and features
    │   └── common             # Common components used across the app
    |   └── Home               # Home page components
    |   └── Me                 # Me page components
    ├── context                # Context for managing global app state
    │   └── UserContext.jsx    # Provides user authentication data globally
    ├── hooks                  # Custom hooks for specialized logic
    │   └── useUser            # Use data from the global context.
    ├── pages                  # Application pages
    ├── utils                  # Utility functions and Firebase configurations
    ├── styles                 # Styles.
    └── types.d.ts             # Global types define here (such as schemas).
```

The main components and utilities are organized under `src/components` and `src/utils`, while `UserContext` manages user state globally to avoid redundant data fetching.

## 2. Keeping Your Work Up-to-Date with `origin/main`

### Step 1: Create a New Feature Branch

- **Why**: Avoid developing directly on `main`. Keeping `main` in sync with `origin/main` makes it easier to update and manage changes.
- **How**: Create and switch to a new branch for your feature, and remember to push it to `origin`:

  ```bash
  git switch -c feat/new-feature-name
  git push -u origin feat/new-feature-name
  ```

### Step 2: Update Your Local `main` with `origin/main`

1. **Switch Back to `main`**: Ensure you're on `main` before updating:

   ```bash
   git switch main
   ```

2. **Stash Your Work**(if needed): If you have uncommitted changes, stash them to avoid conflicts while pulling:

   ```bash
   git stash
   ```

3. **Pull Latest Changes**: Bring in the latest updates from `origin/main`:

   ```bash
   git pull origin main
   ```

### Step 3: Rebase Your Feature Branch onto the Updated `main`

1. **Switch Back to Your Feature Branch**:

   ```bash
   git switch feat/new-feature-name
   ```

2. **Rebase**: Apply your feature branch changes on top of the latest `main`:

   ```bash
   git rebase main
   ```

3. **Apply Stash**(if you stashed changes): Reapply your saved changes once main is updated:

   ```bash
   git stash pop
   ```

4. **Resolve Conflicts** (if any): If conflicts occur, Git will prompt you to resolve them. After resolving, use:

   ```bash
   git add <conflicted-files>
   git rebase --continue
   ```

5. **Push Changes**:

   - **If you have NOT previously pushed code to the remote**:

     ```bash
     git push
     ```

   - **If you HAVE previously pushed code** (with conflicting changes), you may need to force-push to align with the rebased history. **(Do NOT use this on `main`)**

     ```bash
     git push --force-with-lease
     ```

By following these steps, you ensure that `main` remains in sync with `origin/main`, while your feature branch incorporates the latest updates without directly modifying `main`. This keeps your work organized and minimizes conflict risks.

## 3. TypeScript

In this project, TypeScript types and interfaces are used to ensure clarity and catch errors early in the development process. Defining types helps TypeScript provide hints and checks, reducing potential bugs by catching type mismatches before runtime.

### 1. Global Types in `types.d.ts`

For types shared across multiple components or features, define them globally in `types.d.ts`. This allows all components to access these types without needing to import them explicitly, keeping the code DRY.

**Example**:

```typescript
// types.d.ts

interface UserContext = {
  user: User | null;
  loading: boolean;
};

type User {
  uid: string;
  username: string;
  email: string;
  avatar: string;
}
```

With these types defined in `types.d.ts`, all components can directly use `UserContext` and `User` without importing them, ensuring consistency across the project.

### 2. Local Types Definition

For types only relevant to a specific component or file, define them locally within that file to avoid cluttering global types.

**Example**:

```typescript
// src/components/Profile.tsx

type ProfileStats = {
  posts: number;
  followers: number;
  following: number;
};

// Since the `User` type is defined in the global scope, no need to import here.
const Profile = ({ user }: { user: User }) => {
  const stats: ProfileStats = { posts: 50, followers: 100, following: 20 };
  return (
    <div>
      <h1>{user.username}</h1>
      <p>Posts: {stats.posts}</p>
      <p>Followers: {stats.followers}</p>
      <p>Following: {stats.following}</p>
    </div>
  );
};
```

Here, `ProfileStats` is defined locally within `Profile.tsx` because it’s specific to this component.

### 3. Interfaces and props

Interfaces are primarily used for objects that might be extended or combined with other types in the future. They are especially useful for defining the structure of `props` passed into components. This helps TypeScript enforce the correct structure and prevent errors when using the component.

**Example**:

```typescript
// types.d.ts

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

interface ProfileProps {
  profile: UserProfile;
  onFollow: (userId: string) => void;
}
```

In this example, `UserProfile` defines the structure for a user's profile, and `ProfileProps` specifies the `props` expected by the `Profile` component, including the profile data and a follow function.

**Usage in a Component**:

```typescript
// src/components/Profile.tsx

const Profile = ({ profile, onFollow }: ProfileProps) => {
  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.bio}</p>
      {profile.avatarUrl && <img src={profile.avatarUrl} alt={`${profile.username}'s avatar`} />}
      <button onClick={() => onFollow(profile.id)}>Follow</button>
    </div>
  );
};
```

Here, `Profile` receives `profile` and `onFollow` as `props`. TypeScript ensures that `profile` matches the `UserProfile` structure and `onFollow` is a function that takes a `userId` string as an argument. This makes the component’s expectations clear and prevents type-related bugs during development.

### 4. `import type` Instead of `import`

Using `import type` for importing types makes it clear that the import is used only for TypeScript type checking and won’t be included in the compiled JavaScript code. This can improve bundling and reduce unnecessary imports.

**Example**:

```typescript
// src/hooks/useUser.ts

import type { UserContextType } from '@/types';

const useUser = () => {
  // usage of UserContextType in the hook
};
```

Here, `import type { UserContextType }` indicates that `UserContextType` is used only for type checking, not at runtime. This avoids additional runtime imports and helps with bundling efficiency.

## 4. Context

### 1. What is Context?

Context is a React feature that enables data sharing across multiple components without needing to pass props manually at every level. It's especially useful for managing global states, like user authentication data, that are needed by many components.

### 2. Why Use Context Instead of Hooks?

In our previous `StudyBuddy` project, we relied on hooks to fetch user data directly from Firebase. This led to extremely high read counts (thousands of reads per second) whenever users navigated across components, quickly exceeding Firebase’s free limits and degrading performance. By centralizing user data with `UserContext`, data is fetched only once per session and remains available globally, reducing Firebase reads and data-fetching costs.

### 3. How to Use UserContext

#### Accessing User Data

1. **Enable Global UserContext**: `UserProvider` has already been implemented to wrap the main application in `App.jsx`. This enables `UserContext` throughout the app.

   ```jsx
   import { UserProvider } from '@/contexts/UserContext';

   const App = () => <UserProvider>{/* App Components */}</UserProvider>;
   ```

2. **Access User Data in Components**: Use the `useUser` hook to access user data (anything inside their profile you can all access just by e.g. `user.goals`) and authentication functions in any component:

   ```jsx
   import useUser from '@/hooks/useUser';

   const MyComponent = () => {
     {
       /* You can decide what to use from `useUser` */
     }
     const { user, loading, handleSignIn, handleSignOut } = useUser();

     return user ? (
       <div>
         <h1>Welcome, {user.displayName}</h1>
         <button onClick={handleSignOut}>Sign Out</button>
       </div>
     ) : (
       <button onClick={handleSignIn}>Sign In</button>
     );
   };
   ```

#### Updating User Data

Use the `updateProfile` function to update user profile information:

```jsx
const { updateProfile } = useUser();
updateProfile({ displayName: 'New Name' });
```

The `updateProfile` function accepts an object with updated user fields and syncs them with both the context and Firebase, ensuring efficient data sharing across components and reducing the need for direct database access.
