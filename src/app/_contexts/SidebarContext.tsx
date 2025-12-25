"use client";

import React, { createContext, useContext } from "react";

// Create a context for sidebar state
interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  toggleSidebar: () => {},
  openSidebar: () => {},
  closeSidebar: () => {},
});

// Custom hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);

