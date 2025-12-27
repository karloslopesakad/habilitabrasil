"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PlanButtonProps {
  children: React.ReactNode;
  className?: string;
  planName?: string;
}

export default function PlanButton({ children, className, planName }: PlanButtonProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      // Se logado, vai para o dashboard com o plano selecionado
      if (planName) {
        router.push(`/dashboard?plano=${encodeURIComponent(planName)}`);
      } else {
        router.push("/dashboard");
      }
    } else {
      // Se não logado, vai para o login
      if (planName) {
        router.push(`/login?plano=${encodeURIComponent(planName)}`);
      } else {
        router.push("/login");
      }
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

