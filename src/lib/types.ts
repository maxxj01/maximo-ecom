export type Attribute = { label: string; value: string };

export type Product = {
  id: string;
  category: string;
  title: string;
  code: string; // código interno, exibido mascarado (ex: "254 ••• 6658")
  attributes: Attribute[]; // linhas com check verde no card
  price: number;
  planPrice?: number | null; // preço alternativo "Com plano", opcional
  caption?: string | null; // linha curta abaixo do preço (ex: "conta nova verificada sem gastos")
  status: "disponivel" | "esgotado";
  visible: boolean; // aparece ou não na vitrine, independente do status
  imageUrl: string;
  ctaLabel: string; // texto do botão principal, padrão "Pedir"
  ctaType: "order" | "link"; // abre o modal de pedido OU vai para um link externo
  ctaUrl?: string; // usado quando ctaType === "link" (ex: WhatsApp)
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  title: string;
  priceOption: "normal" | "plan";
  unitPrice: number;
  qty: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  buyerName: string;
  buyerContact: string;
  note?: string;
  status: "novo" | "andamento" | "concluido";
  createdAt: string;
};
