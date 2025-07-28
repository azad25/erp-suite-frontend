import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | ERP Suite - Reset Your Password",
  description: "Reset your password for ERP Suite. Enter your email to receive password reset instructions.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}