"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface PlanButtonProps {
  children: React.ReactNode;
  className?: string;
  planName?: string;
  packageId?: string;
}

export default function PlanButton({
  children,
  className,
  planName,
  packageId,
}: PlanButtonProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleClick = () => {
    if (isLoading) return;

    if (!user) {
      // Se não logado, vai para o login com redirect
      const redirectUrl = packageId
        ? `/checkout?package_id=${packageId}`
        : planName
        ? `/dashboard?plano=${encodeURIComponent(planName)}`
        : "/dashboard";
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      // Se logado, vai para checkout (se tiver packageId) ou dashboard
      if (packageId) {
        router.push(`/checkout?package_id=${packageId}`);
      } else if (planName) {
        router.push(`/dashboard?plano=${encodeURIComponent(planName)}`);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <button onClick={handleClick} className={className} disabled={isLoading}>
      {children}
    </button>
  );
}

