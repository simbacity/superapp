import { useState } from "react";

export default function EmojiPicker() {
  const [isOpen, setIsOpen] = useState(true);

  const EMOJIS = ["👍", "👎", "😆", "🎉", "😕", "❤️", "🚀", "👀", "💯"];

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <div className="grid grid-cols-9 py-4 sm:gap-x-1 lg:px-96 md:px-48 justify-items-center justify-self-center">
          {EMOJIS.map((emoji) => (
            <button key={emoji} className="p-1 hover:bg-gray-800 focus:ring focus:ring-white">
              {emoji}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
