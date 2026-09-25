import { ShieldAlert } from "lucide-react";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AcessoRestritoPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lilac-light text-purple">
        <ShieldAlert size={26} />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Área restrita</h1>
      <p className="mt-2 text-sm text-text-muted">
        Esta área é só para quem administra a loja. Se você tem acesso, entre com a senha abaixo.
      </p>
      <AdminLoginForm />
    </div>
  );
}
