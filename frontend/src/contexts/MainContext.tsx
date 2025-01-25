import React, { createContext, useContext, useState, ReactNode } from "react";

interface SectionContextType {
   activeSectionId: string;
   setActiveSectionId: (id: string) => void;

   isMenuOpen: boolean;
   setMenuOpen: (value: boolean) => void;

   userId: string;
   setUserId: (id: string) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContext = () => {
   const context = useContext(SectionContext);
   if (!context) {
      throw new Error(
         "useSectionContext must be used within a SectionProvider"
      );
   }
   return context;
};

interface SectionProviderProps {
   children: ReactNode;
}

export const SectionProvider: React.FC<SectionProviderProps> = ({
   children,
}) => {
   const [activeSectionId, setActiveSectionId] = useState<string>("");
   const [isMenuOpen, setMenuOpen] = useState<boolean>(true);
   const [userId, setUserId] = useState("");

   return (
      <SectionContext.Provider
         value={{
            activeSectionId,
            setActiveSectionId,
            isMenuOpen,
            setMenuOpen,
            userId,
            setUserId,
         }}
      >
         {children}
      </SectionContext.Provider>
   );
};
