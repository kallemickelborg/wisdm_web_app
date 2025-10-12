"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Signup Context
 *
 * Replaces Redux signupSlice with React Context for managing signup form state
 * across multiple signup steps (personal, location, interests, tags).
 */

export interface PersonalInfo {
  name: string | null;
  username: string | null;
  gender: string | null;
  [key: string]: string | null;
}

export interface SignupState {
  personalInfo: PersonalInfo;
  locality: string | null;
  interests: Array<string>;
  traits: Array<string>;
}

interface SignupContextType {
  signupState: SignupState;
  setSignupState: (state: Partial<SignupState>) => void;
  resetSignupState: () => void;
}

const initialState: SignupState = {
  personalInfo: {
    name: null,
    username: null,
    gender: null,
  },
  locality: null,
  interests: [],
  traits: [],
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [signupState, setSignupStateInternal] = useState<SignupState>(initialState);

  const setSignupState = (newState: Partial<SignupState>) => {
    setSignupStateInternal((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  const resetSignupState = () => {
    setSignupStateInternal(initialState);
  };

  return (
    <SignupContext.Provider
      value={{ signupState, setSignupState, resetSignupState }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
}

