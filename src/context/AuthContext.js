"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

function hashPassword(password) {
  // Simple hash for localStorage-based auth (not production-grade)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function generateAvatar(name) {
  const colors = [
    "#7c3aed", "#a855f7", "#ec4899", "#f43f5e",
    "#f97316", "#eab308", "#22c55e", "#06b6d4",
    "#3b82f6", "#8b5cf6",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return { color: colors[index], initial: name.charAt(0).toUpperCase() };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("mbti-session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser(parsed);
      } catch {
        localStorage.removeItem("mbti-session");
      }
    }
    setMounted(true);
  }, []);

  const signup = useCallback((name, email, password) => {
    const users = JSON.parse(localStorage.getItem("mbti-users") || "{}");

    if (users[email]) {
      return { success: false, error: "email_exists" };
    }

    const newUser = {
      id: Date.now().toString(36),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      avatar: generateAvatar(name),
      createdAt: new Date().toISOString(),
      testHistory: [],
    };

    users[email] = newUser;
    localStorage.setItem("mbti-users", JSON.stringify(users));

    const sessionUser = { ...newUser };
    delete sessionUser.passwordHash;
    setUser(sessionUser);
    localStorage.setItem("mbti-session", JSON.stringify(sessionUser));

    return { success: true };
  }, []);

  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem("mbti-users") || "{}");
    const foundUser = users[email.toLowerCase().trim()];

    if (!foundUser) {
      return { success: false, error: "user_not_found" };
    }

    if (foundUser.passwordHash !== hashPassword(password)) {
      return { success: false, error: "wrong_password" };
    }

    const sessionUser = { ...foundUser };
    delete sessionUser.passwordHash;
    setUser(sessionUser);
    localStorage.setItem("mbti-session", JSON.stringify(sessionUser));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("mbti-session");
  }, []);

  const saveTestResult = useCallback((result) => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem("mbti-users") || "{}");
    const dbUser = users[user.email];
    if (!dbUser) return;

    const entry = {
      ...result,
      id: Date.now().toString(36),
      takenAt: new Date().toISOString(),
    };

    if (!dbUser.testHistory) dbUser.testHistory = [];
    dbUser.testHistory.unshift(entry);

    // Keep last 20 results
    if (dbUser.testHistory.length > 20) {
      dbUser.testHistory = dbUser.testHistory.slice(0, 20);
    }

    users[user.email] = dbUser;
    localStorage.setItem("mbti-users", JSON.stringify(users));

    const updatedSession = { ...user, testHistory: dbUser.testHistory };
    setUser(updatedSession);
    localStorage.setItem("mbti-session", JSON.stringify(updatedSession));
  }, [user]);

  const updateProfile = useCallback((updates) => {
    if (!user) return { success: false };

    const users = JSON.parse(localStorage.getItem("mbti-users") || "{}");
    const dbUser = users[user.email];
    if (!dbUser) return { success: false };

    if (updates.name) {
      dbUser.name = updates.name.trim();
      dbUser.avatar = generateAvatar(updates.name);
    }

    users[user.email] = dbUser;
    localStorage.setItem("mbti-users", JSON.stringify(users));

    const updatedSession = { ...user, ...updates, avatar: dbUser.avatar };
    delete updatedSession.passwordHash;
    setUser(updatedSession);
    localStorage.setItem("mbti-session", JSON.stringify(updatedSession));

    return { success: true };
  }, [user]);

  if (!mounted) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        signup,
        login,
        logout,
        saveTestResult,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
