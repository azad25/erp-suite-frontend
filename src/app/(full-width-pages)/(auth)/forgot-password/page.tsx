import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Unibase ERP - Reset Your Password",
  description: "Reset your password for Unibase ERP. Enter your email to receive password reset instructions.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}