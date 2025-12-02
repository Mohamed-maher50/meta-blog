import { Resend } from "resend";

export const resend = new Resend(process.env.NEXT_PUBLIC_SEND_API_KEY);
