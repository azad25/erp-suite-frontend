import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Unibase ERP Dashboard",
  description: "Create a new account for Unibase ERP Dashboard",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
