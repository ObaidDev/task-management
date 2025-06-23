import React, { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import EmailTag from "./EmailTag";

interface EmailTagifyInputProps {
  onEmailsChange?: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
}

const EmailTagifyInput: React.FC<EmailTagifyInputProps> = ({
  onEmailsChange = () => {},
  placeholder = "Enter email addresses...",
  className = "",
}) => {
  const [emails, setEmails] = useState<
    Array<{ value: string; isValid: boolean }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const isValid = validateEmail(trimmedEmail);
    const newEmails = [...emails, { value: trimmedEmail, isValid }];
    setEmails(newEmails);
    onEmailsChange(newEmails.map((e) => e.value));
  };

  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
    onEmailsChange(newEmails.map((e) => e.value));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      if (inputValue) {
        addEmail(inputValue);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      removeEmail(emails.length - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (!pastedText) return;

    const pastedEmails = pastedText.split(/[,;\s]+/);
    pastedEmails.forEach((email) => {
      if (email) addEmail(email);
    });
    setInputValue("");
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`bg-white border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 min-h-[100px] focus-within:ring-2 focus-within:ring-primary focus-within:border-primary ${className}`}
      onClick={handleContainerClick}
    >
      <AnimatePresence>
        {emails.map((email, index) => (
          <motion.div
            key={`${email.value}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <EmailTag
              email={email.value}
              isValid={email.isValid}
              onRemove={() => removeEmail(index)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="text"
        className="flex-grow outline-none border-none bg-transparent min-w-[120px] h-8"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={emails.length === 0 ? placeholder : ""}
      />
    </div>
  );
};

export default EmailTagifyInput;
