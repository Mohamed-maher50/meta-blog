import EmailTemplate, {
  EmailTemplateProps,
} from "@/components/miscellaneous/EmailTemplate";
import { resend } from "@/lib/SendEmail";

export const sendEmail = async ({
  to,
  from = "Acme <onboarding@resend.dev>",
  subject,
  templateProps,
}: {
  to: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  templateProps: EmailTemplateProps;
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: [to],
      subject: subject,
      react: EmailTemplate(templateProps),
    });
    console.log(data);
    console.log(error);
  } catch (error) {
    console.log(error);
  }
};
