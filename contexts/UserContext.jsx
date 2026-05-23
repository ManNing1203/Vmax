import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { loginRequest, registerRequest } from "../services/auth";

export const UserContext = createContext();

const USER_STORAGE_KEY = "loggedInUserData";

function normalizeStorageFragment(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getProfileStorageKey(email) {
  const fragment = normalizeStorageFragment(email) || "default";
  return `loggedInUserProfile.${fragment}`;
}

function mergeProfileFields(baseUser, profileData) {
  if (!profileData) return baseUser;

  return {
    ...baseUser,
    name: profileData.name ?? baseUser.name ?? "",
    salary: profileData.salary ?? baseUser.salary ?? null,
    profileImageUri:
      profileData.profileImageUri ?? baseUser.profileImageUri ?? null,
  };
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(email, password) {
    try {
      const result = await loginRequest(email, password);

      const token = result?.token ?? result?.data?.token ?? null;

      if (!token) {
        throw new Error(result?.message || "Login failed");
      }

      const loggedInUserData = {
        email: email.trim(),
        token,
        profile: result?.user ?? null,
      };

      const cachedProfileRaw = await SecureStore.getItemAsync(
        getProfileStorageKey(email),
      );
      const cachedProfile = cachedProfileRaw
        ? JSON.parse(cachedProfileRaw)
        : null;
      const mergedUser = mergeProfileFields(loggedInUserData, cachedProfile);

      setUser(mergedUser);
      await SecureStore.setItemAsync(
        USER_STORAGE_KEY,
        JSON.stringify(mergedUser),
      );

      return mergedUser;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  }

  async function register(email, password) {
    try {
      const result = await registerRequest(email, password);

      await login(email, password);

      return result;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  }

  async function logout() {
    setUser(null);
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
  }

  async function updateUser(partial) {
    try {
      const next = { ...(user ?? {}), ...partial };
      setUser(next);
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(next));

      if (next.email) {
        const profileKey = getProfileStorageKey(next.email);
        const profileCacheRaw = await SecureStore.getItemAsync(profileKey);
        const profileCache = profileCacheRaw ? JSON.parse(profileCacheRaw) : {};
        const profileNext = {
          ...profileCache,
          name: next.name ?? profileCache.name ?? "",
          salary: next.salary ?? profileCache.salary ?? null,
          profileImageUri:
            next.profileImageUri ?? profileCache.profileImageUri ?? null,
        };

        await SecureStore.setItemAsync(profileKey, JSON.stringify(profileNext));
      }

      return next;
    } catch (error) {
      throw new Error(error?.message || "Failed to update user");
    }
  }

  async function getInitialUserValue() {
    try {
      const loggedInUser = await SecureStore.getItemAsync(USER_STORAGE_KEY);

      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        updateUser,
        logout,
        register,
        authChecked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
