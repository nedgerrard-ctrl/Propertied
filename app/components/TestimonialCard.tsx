type TestimonialCardProps = {
  rating: number
  review: string
  username: string
  role?: string
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3 w-3 ${filled ? 'fill-[#c8a96e]' : 'fill-[#ddd3c6]'}`}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.58 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  )
}

export default function TestimonialCard({
  rating,
  review,
  username,
  role,
}: TestimonialCardProps) {
  return (
    <article className="flex flex-col bg-white p-8 border border-[#e8e2d9]">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < rating} />
        ))}
      </div>

      {/* Opening quote mark + review */}
      <p className="mt-1 text-[2.5rem] leading-none font-light text-[#c8a96e] select-none">
        &ldquo;
      </p>
      <p className="text-[13.5px] leading-[1.85] text-[#4b4138] flex-1">
        {review}
      </p>

      {/* Author */}
      <div className="mt-7 flex items-center gap-4 border-t border-[#f0ebe4] pt-6">
        {/* Monogram */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1c1814]">
          <span className="text-[12px] font-semibold uppercase tracking-widest text-[#c8a96e]">
            {username.charAt(0)}
          </span>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-[#1f1a17]">{username}</p>
          {role && (
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[#8a7b6d]">
              {role}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
