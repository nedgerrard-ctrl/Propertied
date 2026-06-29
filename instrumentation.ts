export async function register() {
  // Set fallback secrets before NextAuth initialises — works even with empty Netlify env vars
  if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = 'PpmPropertyProjectMarketing2026SecretKey!!'
  }
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = 'PpmPropertyProjectMarketing2026SecretKey!!'
  }
}
