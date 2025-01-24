import React, { createContext, useContext, useState, ReactNode } from "react";

// Определим интерфейс для контекста
interface SectionContextType {
   activeSectionId: string;
   setActiveSectionId: (id: string) => void;
}

// Создадим контекст с начальным значением (undefined, чтобы позже было безопасно проверять его)
const SectionContext = createContext<SectionContextType | undefined>(undefined);

// Хук для получения контекста
export const useSectionContext = () => {
   const context = useContext(SectionContext);
   if (!context) {
      throw new Error(
         "useSectionContext must be used within a SectionProvider"
      );
   }
   return context;
};

// Указываем тип пропсов для компонента SectionProvider, включая children
interface SectionProviderProps {
   children: ReactNode; // Тип для children, что позволяет передавать любые элементы
}

// Провайдер контекста
export const SectionProvider: React.FC<SectionProviderProps> = ({
   children,
}) => {
   const [activeSectionId, setActiveSectionId] = useState<string>("");

   return (
      <SectionContext.Provider value={{ activeSectionId, setActiveSectionId }}>
         {children} {/* Все дочерние компоненты получат доступ к контексту */}
      </SectionContext.Provider>
   );
};
