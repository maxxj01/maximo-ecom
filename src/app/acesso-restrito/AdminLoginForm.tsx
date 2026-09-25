"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "@/lib/actions";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await loginAction(password);
      if (result.ok) {
        toast.success("Acesso liberado.");
        router.push("/admin/produtos");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-xs flex-col gap-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha de admin"
        required
        className="w-full rounded-full border border-border bg-bg px-4 py-2.5 text-center text-sm outline-none focus:border-purple"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-purple px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
