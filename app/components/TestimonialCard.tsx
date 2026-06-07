type TestimonialCardProps = {
  review: string
  username: string
  role?: string
}

export default function TestimonialCard({
  review,
  username,
  role,
}: TestimonialCardProps) {
  return (
    <article className="flex flex-col bg-white p-8 border border-[#e8e2d9]">
      {/* Opening quote mark + review */}
      <p className="text-[2.5rem] leading-none font-light text-[#c8a96e] select-none">
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
