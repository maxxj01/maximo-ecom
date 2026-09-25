import Image from "next/image";
import logoLight from "@/assets/brand/logo-light.png";

const WHATSAPP_URL = "https://wa.me/5587981738048";
const INSTAGRAM_URL = "https://www.instagram.com/maximoecom/";

// lucide-react removed brand icons, so Instagram is a small inline SVG.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10" style={{ backgroundColor: "#0A0A14" }}>
      <div className="mx-auto max-w-6xl px-4 py-12 min-[900px]:px-6">
        <div className="flex flex-col items-center gap-10 text-center min-[900px]:flex-row min-[900px]:items-start min-[900px]:justify-between min-[900px]:text-left">
          <div className="flex flex-col items-center min-[900px]:items-start">
            <Image src={logoLight} alt="Máximo Ecom" className="h-8 w-auto" />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Políticas</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="#" className="hover:text-white">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Suporte</h3>
            <p className="text-sm text-white/60">
              Atendimento via WhatsApp:{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-light hover:opacity-80">
                +55 87 98173-8048
              </a>
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="#produtos" className="hover:text-white">
                  Produtos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <InstagramIcon size={16} />
            Siga-nos no Instagram
          </a>

          <p className="mt-4 text-xs text-white/40">
            © {new Date().getFullYear()} Máximo Ecom. Todos os direitos reservados.
          </p>
          <p className="mt-1 text-xs text-white/40">Razão Social: Maximo Ecom LTDA</p>
          <p className="mt-1 text-xs text-white/40">CNPJ: 60.402.197/0001-17</p>
        </div>
      </div>
    </footer>
  );
}
