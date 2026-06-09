const cards = [
  {
    name: "Visa",
    className: "bg-white text-[#1434cb]",
    mark: "VISA",
  },
  {
    name: "Mastercard",
    className: "bg-white text-zinc-900",
    mark: "Mastercard",
    symbol: (
      <span className="relative mr-1.5 inline-flex h-4 w-6 items-center">
        <span className="absolute left-0 h-4 w-4 rounded-full bg-[#eb001b]" />
        <span className="absolute right-0 h-4 w-4 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
    ),
  },
  {
    name: "CMI",
    className: "bg-white text-[#0067b1]",
    mark: "CMI",
  },
];

type AcceptedCardsProps = {
  compact?: boolean;
};

export default function AcceptedCards({ compact = false }: AcceptedCardsProps) {
  return (
    <div
      className={`flex flex-wrap items-center ${
        compact ? "gap-2" : "justify-center gap-2.5"
      }`}
      aria-label="Accepted card brands"
    >
      {cards.map((card) => (
        <span
          key={card.name}
          title={card.name}
          className={`inline-flex h-8 min-w-14 items-center justify-center rounded border border-zinc-300 px-2 text-[0.7rem] font-black leading-none shadow-sm ${card.className}`}
        >
          {card.symbol}
          {card.mark}
        </span>
      ))}
    </div>
  );
}
