import crypto from "crypto";

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  otpCode: string;
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP code.
 */
export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Dispatches an SMS OTP code to a Pakistani mobile number (+92 3XX XXXXXXX)
 * using the configured gateway (Twilio, BrandSMS, or local dev simulator).
 */
export async function dispatchSmsOtp(
  phoneNumber: string,
  otpCode: string,
  purpose: "registration" | "login" | "reset" = "registration"
): Promise<SmsSendResult> {
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "").trim();
  const provider = process.env.SMS_PROVIDER || "local";

  const messageText = `TECHLO: Your verification security code is ${otpCode}. Valid for 10 minutes. Do not share this code with anyone. (a product of arix)`;

  console.log(`[SMS GATEWAY - ${provider.toUpperCase()}] Sending OTP ${otpCode} to ${cleanPhone}`);

  try {
    // 1. Twilio SMS Gateway (if configured)
    if (provider === "twilio" && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");

      const params = new URLSearchParams();
      params.append("To", cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`);
      params.append("From", process.env.TWILIO_PHONE_NUMBER || "");
      params.append("Body", messageText);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Twilio SMS failed to send");
      }

      return { success: true, messageId: data.sid, otpCode };
    }

    // 2. Pakistani Branded SMS Gateway (BrandSMS.pk / Jazz / Telenor API)
    if (provider === "brandsms" && process.env.BRAND_SMS_API_KEY) {
      // Standard Pakistani Gateway Format (e.g. BrandSMS, FastSMS, Jazz Business API)
      const url = `https://sms.brandsms.pk/api/send?api_key=${encodeURIComponent(
        process.env.BRAND_SMS_API_KEY
      )}&sender=${encodeURIComponent(process.env.BRAND_SMS_SENDER_ID || "TECHLO")}&to=${encodeURIComponent(
        cleanPhone
      )}&message=${encodeURIComponent(messageText)}`;

      const res = await fetch(url);
      const data = await res.json();

      return { success: true, messageId: data.message_id || "brandsms_ok", otpCode };
    }

    // 3. Local Development Mode (Console & In-App verification)
    console.log(`\n======================================================`);
    console.log(`📱 [TECHLO SMS DISPATCH GATEWAY]`);
    console.log(`To: ${cleanPhone}`);
    console.log(`Message: ${messageText}`);
    console.log(`Security Code: [ ${otpCode} ]`);
    console.log(`======================================================\n`);

    return { success: true, messageId: `local_${Date.now()}`, otpCode };
  } catch (error: any) {
    console.error("[SMS GATEWAY ERROR]:", error);
    return { success: false, error: error.message, otpCode };
  }
}
