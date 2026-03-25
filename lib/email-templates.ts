type ResetPasswordTemplateParams = {
  resetLink: string;
  expiryMinutes: number;
};

export function buildResetPasswordEmail({
  resetLink,
  expiryMinutes,
}: ResetPasswordTemplateParams) {
  const subject = "Reset your password";

  const text = [
    "We received a request to reset your password.",
    "",
    `Use this link to set a new password: ${resetLink}`,
    "",
    `This link will expire in ${expiryMinutes} minutes.`,
    "",
    "If you did not request this, you can safely ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2923; max-width: 600px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #9a8f83; margin-bottom: 8px;">
        Property Project Marketing
      </p>

      <h1 style="font-size: 28px; margin: 0 0 16px;">Reset your password</h1>

      <p style="margin: 0 0 16px;">
        We received a request to reset your password.
      </p>

      <p style="margin: 0 0 24px;">
        Click the button below to choose a new password.
      </p>

      <p style="margin: 0 0 24px;">
        <a
          href="${resetLink}"
          style="
            display: inline-block;
            background: #2f2923;
            color: #fbfaf7;
            text-decoration: none;
            padding: 12px 18px;
            border-radius: 12px;
            font-weight: 600;
          "
        >
          Reset password
        </a>
      </p>

      <p style="margin: 0 0 12px; color: #6e655c;">
        Or copy and paste this link into your browser:
      </p>

      <p style="margin: 0 0 24px; word-break: break-all;">
        <a href="${resetLink}" style="color: #2f2923;">
          ${resetLink}
        </a>
      </p>

      <p style="margin: 0 0 12px; color: #6e655c;">
        This link will expire in ${expiryMinutes} minutes.
      </p>

      <p style="margin: 0; color: #6e655c;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  return { subject, text, html };
}