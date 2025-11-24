const errorsAndMessages: Record<string, string> = {
  CredentialsSignin: "email or password not correct",
  AccessDenied: "you don't have permissions or email not verified",
  verificationError: "email need to verify check your inbox",
};

export const authErrorMessages = (error: string) => {
  console.log(error);
  return errorsAndMessages[error] || "Oops somethings wrong!";
};
