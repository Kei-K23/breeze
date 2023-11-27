"use client";

import React, { createContext, useContext, useState } from "react";

type SheetContextType = {
  isLeftSheetOpen: boolean;
  isRightSheetOpen: boolean;
  setIsLeftSheetOpen: (isLeftSheetOpen: boolean) => void;
  setIsRightSheetOpen: (isRightSheetOpen: boolean) => void;
};

const SheetContext = createContext<SheetContextType>({
  isLeftSheetOpen: false,
  isRightSheetOpen: false,
  setIsLeftSheetOpen: () => {},
  setIsRightSheetOpen: () => {},
});

export function useSheet() {
  return useContext(SheetContext);
}

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [isLeftSheetOpen, setIsLeftSheetOpen] = useState(false);
  const [isRightSheetOpen, setIsRightSheetOpen] = useState(false);
  return (
    <SheetContext.Provider
      value={{
        isLeftSheetOpen,
        isRightSheetOpen,
        setIsLeftSheetOpen,
        setIsRightSheetOpen,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}
