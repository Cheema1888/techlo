export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Dispatches a 6-digit verification code to the student's email.
 * Supports:
 * 1. Resend API (Free Tier: 3,000 emails/month) via RESEND_API_KEY
 * 2. Local/Dev console output for instant frictionless development
 */
export async function dispatchEmailOtp(
  email: string,
  otpCode: string,
  fullName: string = "Student"
): Promise<EmailSendResult> {
  const cleanEmail = email.toLowerCase().trim();
  const resendApiKey = process.env.RESEND_API_KEY;

  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV EMAIL OTP] ${cleanEmail}: ${otpCode}`);
  }

  const safeName = fullName.replace(/[<>&"']/g, "");

  try {
    // 1. Resend Free Tier Integration (if RESEND_API_KEY is configured in Vercel)
    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "TECHLO <verify@send.techlo.store>",
          to: [cleanEmail],
          subject: `${otpCode} is your TECHLO verification code`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #0A0A0A; color: #FFFFFF; border-radius: 20px; border: 1px solid #262626;">
              <div style="margin-bottom: 24px;">
                <span style="font-family: monospace; font-size: 24px; font-weight: 900; letter-spacing: -1px; color: #FFFFFF;">TECHLO</span>
                <span style="font-size: 11px; color: #888888; font-family: monospace; margin-left: 8px;">a product of arix</span>
              </div>
              
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #FFFFFF;">Welcome, ${safeName}!</h2>
              <p style="font-size: 14px; color: #A3A3A3; line-height: 1.6; margin-bottom: 24px;">
                Thank you for joining Pakistan's student hardware exchange. Use the security code below to activate your account:
              </p>
              
              <div style="background: #141414; border: 1px solid #262626; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #FFFFFF;">${otpCode}</span>
                <div style="font-size: 11px; color: #737373; margin-top: 8px; font-family: monospace;">Valid for 15 minutes • Do not share with anyone</div>
              </div>
              
              <p style="font-size: 12px; color: #737373; line-height: 1.5; margin-bottom: 0;">
                If you did not request this code, please ignore this email.
              </p>
            </div>
          `,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        console.error("[RESEND DISPATCH ERROR]:", resData);
        return { success: false, error: resData.message || "Failed to dispatch email" };
      } else {
        console.log("[RESEND DISPATCH SUCCESS]: Message ID:", resData.id);
        return { success: true, messageId: resData.id };
      }
    }

    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "Email delivery is not configured" };
    }
    return { success: true, messageId: `local_email_${Date.now()}` };
  } catch (error: any) {
    console.error("[EMAIL GATEWAY ERROR]:", error);
    return { success: false, error: "Email delivery failed" };
  }
}
