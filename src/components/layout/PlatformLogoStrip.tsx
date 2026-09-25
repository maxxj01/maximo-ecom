import Image from "next/image";
import brandIcon from "@/assets/brand/icon.png";

type LogoItem = {
  key: string;
  src: string;
  alt: string;
  hub?: boolean;
};

// Ordem enviada: Google Ads, Stripe, Shopify — com o ícone da marca inserido
// no meio da sequência, maior e em destaque, como "hub" central.
const LOGOS: LogoItem[] = [
  { key: "google-ads", src: "/icons/google-ads.png", alt: "Google Ads" },
  { key: "stripe", src: "/icons/stripe.png", alt: "Stripe" },
  { key: "maximo", src: "", alt: "Máximo Ecom", hub: true },
  { key: "shopify", src: "/icons/shopify.png", alt: "Shopify" },
];

function IconTile({ item }: { item: LogoItem }) {
  const sizeClass = item.hub
    ? "w-[64px] h-[64px] min-[500px]:w-[84px] min-[500px]:h-[84px]"
    : "w-[48px] h-[48px] min-[500px]:w-[62px] min-[500px]:h-[62px]";

  return (
    <div
      className={`relative z-10 flex shrink-0 items-center justify-center rounded-2xl border ${sizeClass} ${
        item.hub ? "border-purple bg-[#12101c]" : "border-white/10 bg-[#111018]"
      }`}
      style={
        item.hub
          ? {
              boxShadow:
                "0 0 0 1px rgba(124,58,237,0.35), 0 0 18px 4px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
            }
          : {
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.5)",
            }
      }
    >
      <div className="relative h-[48%] w-[48%]">
        {item.hub ? (
          <Image src={brandIcon} alt={item.alt} fill sizes="84px" className="object-contain" />
        ) : (
          <Image src={item.src} alt={item.alt} fill sizes="62px" className="object-contain" />
        )}
      </div>
    </div>
  );
}

export function PlatformLogoStrip() {
  return (
    <div className="relative z-10 mt-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10">
      <div
        className="relative overflow-x-auto"
        style={{ background: "linear-gradient(180deg, #0A0A14 0%, #000000 100%)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1.4px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div className="relative flex w-max min-w-full items-center justify-center gap-5 px-8 py-6 min-[500px]:gap-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-10 right-10 top-1/2 z-0 h-px -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.4) 15%, rgba(167,139,250,0.4) 85%, transparent 100%)",
            }}
          />

          {LOGOS.map((item) => (
            <IconTile key={item.key} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
