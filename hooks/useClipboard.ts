import React, { useState } from "react";

const useClipboard = () => {
  const [copiedField, setCopiedField] = useState<null | boolean>(null);
  const [coping, setCoping] = useState(false);
  const copier = async (text: string) => {
    try {
      setCoping(true);
      await navigator.clipboard.writeText(text);
      setCopiedField(true);
      setTimeout(() => setCopiedField(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return { copier, coping, copiedField };
};

export default useClipboard;
