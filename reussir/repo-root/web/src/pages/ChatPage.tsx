import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatPage.module.css";
import ChatView from "../components/ChatView";

const ChatPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className={styles.container}>
      <ChatView />
    </div>
  );
};

export default ChatPage;
