import { MouseEventHandler } from "react";

interface SignInWithGoogleButtonProps {
  onClick: MouseEventHandler;
  text: string;
}

export default function SignInWithGoogleButton({ text, onClick }: SignInWithGoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="m-auto hover:opacity-90 flex items-center py-1 pl-1 pr-3 space-x-3 text-gray-600 bg-white rounded shadow-md">
      <div className="py-2 pl-2 pr-1 bg-white rounded">
        <GoogleIconSVG />
      </div>
      <span className="pr-1 leading-none">{text}</span>
    </button>
  );
}

function GoogleIconSVG() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.7666 9.6498H22.8V9.6H12V14.4H18.7818C17.7924 17.1942 15.1338 19.2 12 19.2C8.0238 19.2 4.8 15.9762 4.8 12C4.8 8.0238 8.0238 4.8 12 4.8C13.8354 4.8 15.5052 5.4924 16.7766 6.6234L20.1708 3.2292C18.0276 1.2318 15.1608 0 12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 11.1954 23.9172 10.41 23.7666 9.6498Z"
        fill="#FFC107"
      />
      <path
        d="M1.38379 6.4146L5.32639 9.306C6.39319 6.6648 8.97679 4.8 12.0002 4.8C13.8356 4.8 15.5054 5.4924 16.7768 6.6234L20.171 3.2292C18.0278 1.2318 15.161 0 12.0002 0C7.39099 0 3.39379 2.6022 1.38379 6.4146Z"
        fill="#FF3D00"
      />
      <path
        d="M11.9999 24C15.0995 24 17.9159 22.8138 20.0453 20.8848L16.3313 17.742C15.1265 18.6546 13.6289 19.2 11.9999 19.2C8.87869 19.2 6.22849 17.2098 5.23009 14.4324L1.31689 17.4474C3.30289 21.3336 7.3361 24 11.9999 24Z"
        fill="#4CAF50"
      />
      <path
        d="M23.7666 9.6499H22.8V9.6001H12V14.4001H18.7818C18.3066 15.7423 17.4432 16.8997 16.3296 17.7427C16.3302 17.7421 16.3308 17.7421 16.3314 17.7415L20.0454 20.8843C19.7826 21.1231 24 18.0001 24 12.0001C24 11.1955 23.9172 10.4101 23.7666 9.6499Z"
        fill="#1976D2"
      />
    </svg>
  );
}
