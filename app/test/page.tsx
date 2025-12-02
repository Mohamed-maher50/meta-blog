"use client";
import EmailTemplate from "@/components/miscellaneous/EmailTemplate";

// eslint-disable-next-line import/no-anonymous-default-export
export default () =>
  EmailTemplate({
    type: "OTP",
    code: "125251",
    senderEmail: "daly.div",
    subject: "sdfsdff",
    date: new Date().toISOString(),
  });
