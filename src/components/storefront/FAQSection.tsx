"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Como recebo o acesso aos produtos?",
    answer:
      "Após a confirmação do pagamento (cartão ou PIX), você recebe os dados de acesso e as instruções completas pelo WhatsApp.",
  },
  {
    question: "Como funciona a garantia de reposição?",
    answer:
      "Oferecemos garantia de login. Se o perfil vier com restrição antes do uso e estiver dentro das políticas, fazemos a substituição.",
  },
  {
    question: "Os perfis já vêm aquecidos?",
    answer:
      "Sim. Os perfis passam por uma esteira de aquecimento para criar histórico e reduzir risco operacional.",
  },
  {
    question: "Vocês prestam suporte após a compra?",
    answer: "Sim. O suporte via WhatsApp ajuda nas dúvidas e configurações da sua estrutura.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 min-[900px]:px-6">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-extrabold text-text">
        <span className="h-6 w-1 shrink-0 rounded-full bg-purple" />
        Dúvidas Frequentes
      </h2>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className="overflow-hidden rounded-xl border border-border bg-bg-subtle"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-text">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-purple transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-text-muted">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
