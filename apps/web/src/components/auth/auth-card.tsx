import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return <div className="w-full max-w-md space-y-6">{children}</div>;
}

interface AuthHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function AuthHeader({ eyebrow, title, description }: AuthHeaderProps) {
  return (
    <div className="space-y-2">
      {eyebrow && (
        <p className="text-sm font-medium text-[#087A55] uppercase tracking-wider">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-bold text-[#101828]">{title}</h1>
      {description && (
        <p className="text-[#667085] text-sm">{description}</p>
      )}
    </div>
  );
}

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "or" }: AuthDividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-[#E5EAE7]" />
      <span className="text-sm text-[#667085]">{text}</span>
      <div className="flex-1 h-px bg-[#E5EAE7]" />
    </div>
  );
}
