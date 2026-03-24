type TestimonialCardProps = {
  rating: number;
  review: string;
  username: string;
  image: string;
  role?: string;
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${filled ? "fill-[#b08d57]" : "fill-[#ddd3c6]"}`}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.58 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

export default function TestimonialCard({
  rating,
  review,
  username,
  image,
  role,
}: TestimonialCardProps) {
  return (
    <article className="h-full rounded-sm border border-[#dfd4c7] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon key={index} filled={index < rating} />
        ))}
      </div>

      <p className="mt-5 text-[14px] leading-7 text-[#4b4138]">
        “{review}”
      </p>

      <div className="mt-6 flex items-center gap-4 border-t border-[#eee6dc] pt-5">
        <div className="h-14 w-14 overflow-hidden rounded-full border border-[#ddd3c6] bg-[#efe8dd]">
          <img
            src={image}
            alt={username}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <p className="text-[14px] font-semibold text-[#1f1a17]">{username}</p>
          {role && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#8a7b6d]">
              {role}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}