"use client";

interface UserIconProps {
  onClick: () => void;
}

export default function UserIcon({ onClick }: UserIconProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 w-12 h-12 bg-transparent border-2 border-white/30 rounded-full flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-all duration-200 z-50"
      aria-label="Abrir menu do usuário"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
