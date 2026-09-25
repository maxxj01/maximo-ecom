"use client";

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirmar",
  danger,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" aria-label="Fechar" onClick={onCancel} className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-bg p-6 shadow-xl">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-lilac-light/60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white hover:opacity-90 ${
              danger ? "bg-red" : "bg-purple"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
