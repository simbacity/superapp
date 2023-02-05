import Image from "next/image";
import { useState } from "react";

export default function Avatar({ src, className }: { src: string; className: string }) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative border border-gray-500 border-solid rounded-full ${className}`}>
      <Image
        src={error ? "/default-avatar.svg" : src}
        onError={() => setError(true)}
        alt="Profile picture"
        layout="fill"
        objectFit="cover"
        className="rounded-full"
      />
    </div>
  );
}
