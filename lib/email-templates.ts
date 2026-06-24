type WelcomeVerificationTemplateParams = {
  firstName: string;
  email: string;
  verifyLink: string;
};

export function buildWelcomeVerificationEmail({
  firstName,
  email,
  verifyLink,
}: WelcomeVerificationTemplateParams) {
  const subject = "Welcome to PPM — please verify your email";

  const text = [
    `Welcome to Property Project Marketing, ${firstName}!`,
    "",
    `Your account has been created using: ${email}`,
    "",
    "Please verify your email address by visiting the link below:",
    verifyLink,
    "",
    "This link will expire in 24 hours.",
    "",
    "If you did not create this account, you can safely ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2923; max-width: 600px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #9a8f83; margin-bottom: 8px;">
        Property Project Marketing
      </p>

      <h1 style="font-size: 28px; margin: 0 0 16px;">Welcome, ${firstName}</h1>

      <p style="margin: 0 0 16px;">
        Your PPM account has been created using <strong>${email}</strong>.
      </p>

      <p style="margin: 0 0 24px;">
        Please verify your email address to activate your account.
      </p>

      <p style="margin: 0 0 24px;">
        <a
          href="${verifyLink}"
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
          Verify email address
        </a>
      </p>

      <p style="margin: 0 0 12px; color: #6e655c;">
        Or copy and paste this link into your browser:
      </p>

      <p style="margin: 0 0 24px; word-break: break-all;">
        <a href="${verifyLink}" style="color: #2f2923;">
          ${verifyLink}
        </a>
      </p>

      <p style="margin: 0 0 12px; color: #6e655c;">
        This link will expire in 24 hours.
      </p>

      <p style="margin: 0; color: #6e655c;">
        If you did not create this account, you can safely ignore this email.
      </p>
    </div>
  `;

  return { subject, text, html };
}

type VerificationCodeTemplateParams = {
  firstName: string;
  code: string;
};

export function buildVerificationCodeEmail({ firstName, code }: VerificationCodeTemplateParams) {
  const subject = "Your PPM verification code";

  const text = [
    `Hi ${firstName},`,
    "",
    "Your verification code is:",
    "",
    code,
    "",
    "This code expires in 10 minutes. Do not share it with anyone.",
    "",
    "If you did not request this, you can safely ignore this email.",
  ].join("\n");

  const digits = code.split("");
  const digitBoxes = digits
    .map(
      (d) =>
        `<span style="display:inline-block;width:44px;height:52px;line-height:52px;text-align:center;font-size:24px;font-weight:700;letter-spacing:0;background:#f4f1ea;border:1px solid #ddd5c8;border-radius:8px;margin:0 4px;color:#2f2923;">${d}</span>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2923; max-width: 600px; margin: 0 auto; padding: 24px;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #9a8f83; margin-bottom: 8px;">
        Property Project Marketing
      </p>

      <h1 style="font-size: 26px; margin: 0 0 16px;">Verify your email</h1>

      <p style="margin: 0 0 24px;">
        Hi ${firstName}, enter this code to complete your PPM account registration.
      </p>

      <div style="margin: 0 0 24px; text-align: center;">
        ${digitBoxes}
      </div>

      <p style="margin: 0 0 12px; color: #6e655c;">
        This code expires in <strong>10 minutes</strong>.
      </p>

      <p style="margin: 0; color: #6e655c;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  return { subject, text, html };
}

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