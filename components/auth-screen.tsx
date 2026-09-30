"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { errorMessage, forgotPassword, resetPassword, verifyOtp } from "@/lib/api";

export function AuthScreen({ mode }: { mode: "login" | "forgot" | "otp" | "reset" }) {
  const router = useRouter(); const search = useSearchParams();
  const [email, setEmail] = useState(search.get("email") || "");
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const login = useMutation({ mutationFn: async () => {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) throw new Error("Invalid credentials or administrator access is required.");
  }, onSuccess: () => { toast.success("Welcome back"); router.push("/dashboard"); router.refresh(); }, onError: e => toast.error(errorMessage(e)) });
  const forgot = useMutation({ mutationFn: () => forgotPassword(email), onSuccess: () => { toast.success("OTP sent to your email"); router.push(`/enter-otp?email=${encodeURIComponent(email)}`); }, onError: e => toast.error(errorMessage(e)) });
  const verify = useMutation({ mutationFn: () => verifyOtp(email, otp), onSuccess: () => { toast.success("OTP verified"); router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`); }, onError: e => toast.error(errorMessage(e)) });
  const reset = useMutation({ mutationFn: () => resetPassword(email, search.get("otp") || otp, password), onSuccess: () => { toast.success("Password updated"); router.push("/login"); }, onError: e => toast.error(errorMessage(e)) });
  const pending = login.isPending || forgot.isPending || verify.isPending || reset.isPending;
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (mode === "reset" && password !== confirm) return toast.error("Passwords do not match");
    if (mode === "login") login.mutate(); if (mode === "forgot") forgot.mutate(); if (mode === "otp") verify.mutate(); if (mode === "reset") reset.mutate();
  }
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>{mode === "login" ? "Login To Your Account" : mode === "forgot" ? "Forgot Password" : mode === "otp" ? "Enter OTP" : "Reset Password"}</h1>
    {mode === "login" && <p>Please enter your email and password to continue</p>}
    {mode === "forgot" && <p>Enter your registered email address. We’ll send you a code to reset your password.</p>}
    {(mode === "login" || mode === "forgot") && <label>Email Address<div className="auth-input"><Mail size={19}/><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /></div></label>}
    {(mode === "login" || mode === "reset") && <label>{mode === "reset" ? "New Password" : "Password"}<div className="auth-input"><LockKeyhole size={19}/><input type="password" placeholder={mode === "reset" ? "New Password" : "Password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}/></div></label>}
    {mode === "reset" && <label>Confirm Password<div className="auth-input"><LockKeyhole size={19}/><input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6}/></div></label>}
    {mode === "otp" && <><div className="otp-inputs">{Array.from({length:6}, (_,i) => <input key={i} aria-label={`OTP digit ${i+1}`} inputMode="numeric" maxLength={1} value={otp[i] || ""} onChange={e => { const next = otp.split(""); next[i] = e.target.value.replace(/\D/g, ""); setOtp(next.join("")); if(e.target.value) (e.target.nextElementSibling as HTMLInputElement)?.focus(); }} />)}</div><p className="otp-resend">Didn’t Receive OTP? <button type="button" onClick={() => forgot.mutate()}>RESEND OTP</button></p></>}
    {mode === "login" && <Link className="forgot-link" href="/forgot-password">Forgot Password?</Link>}
    <button className="primary auth-submit" disabled={pending || (mode === "otp" && otp.length !== 6)}>{pending ? "Please wait..." : mode === "login" ? "Login" : mode === "forgot" ? "Send OTP" : mode === "otp" ? "Verify" : "Continue"}</button>
    {mode !== "login" && <Link className="back-login" href="/login">Back to login</Link>}
  </form></main>;
}
