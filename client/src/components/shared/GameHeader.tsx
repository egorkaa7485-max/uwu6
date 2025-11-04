import { useLocation } from "wouter";

interface GameHeaderProps {
  title: string;
  backPath?: string;
}

export function GameHeader({ title, backPath = "/games" }: GameHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => setLocation(backPath)}
        className="w-10 h-10 rounded-full bg-[#15151A] flex items-center justify-center"
        data-testid="button-back"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="flex-1 bg-black rounded-full px-6 py-2">
        <h1 className="text-white text-center text-sm font-medium" data-testid="text-game-title">
          {title}
        </h1>
      </div>
    </div>
  );
}
