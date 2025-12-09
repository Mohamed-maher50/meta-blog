import { useState } from "react";
type OpenState = {
  node: boolean;
  color: boolean;
  link: boolean;
  ai: boolean;
};
const useGenerativeMenu = () => {
  const [menu, setMenu] = useState<OpenState>({
    node: false,
    color: false,
    link: false,
    ai: false,
  });
  const setMenuItem = (key: keyof OpenState, value: boolean) => {
    setMenu((prev) => {
      if (prev[key] === value) return prev; // ✅ no re-render
      return { ...prev, [key]: value };
    });
  };
  return {
    setMenuItem,
    ...menu,
  };
};

export default useGenerativeMenu;
