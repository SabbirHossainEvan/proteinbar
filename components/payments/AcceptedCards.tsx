import Image from "next/image";

const cards = [
  {
    name: "CMI",
    src: "/payment-security/cmi.png",
    width: 203,
    height: 160,
  },
  {
    name: "Verified by Visa",
    src: "/payment-security/verified-by-visa.png",
    width: 600,
    height: 265,
  },
  {
    name: "Mastercard SecureCode",
    src: "/payment-security/mastercard-securecode.png",
    width: 500,
    height: 230,
  },
  {
    name: "American Express",
    src: "/payment-security/amex.png",
    width: 167,
    height: 169,
  },
  {
    name: "UnionPay",
    src: "/payment-security/unionpay.png",
    width: 920,
    height: 639,
  },
  {
    name: "MarocPay",
    src: "/payment-security/marocpay.png",
    width: 800,
    height: 688,
  },
];

type AcceptedCardsProps = {
  compact?: boolean;
};

export default function AcceptedCards({ compact = false }: AcceptedCardsProps) {
  return (
    <div
      className={`flex flex-wrap items-center ${
        compact ? "gap-2" : "justify-center gap-3"
      }`}
      aria-label="Accepted card brands"
    >
      {cards.map((card) => (
        <span
          key={card.name}
          title={card.name}
          className={`inline-flex items-center justify-center rounded border border-zinc-200 bg-white shadow-sm ${
            compact ? "h-8 min-w-14 px-2" : "h-11 min-w-20 px-3"
          }`}
        >
          <Image
            src={card.src}
            alt={card.name}
            width={card.width}
            height={card.height}
            className={compact ? "max-h-5 w-auto" : "max-h-7 w-auto"}
          />
        </span>
      ))}
    </div>
  );
}
