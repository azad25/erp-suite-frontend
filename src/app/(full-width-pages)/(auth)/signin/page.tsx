import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Unibase ERP Dashboard",
  description: "Sign in to access your Unibase ERP Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
