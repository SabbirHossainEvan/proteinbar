"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const CODE_LENGTH = 6;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0] ?? ""}*@${domain}`;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "verify" | "success">("email");
  const [sentCode, setSentCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  const maskedEmail = useMemo(() => maskEmail(email), [email]);

  const handleSendCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const generatedCode = generateCode();
    setEmail(normalizedEmail);
    setSentCode(generatedCode);
    setInputCode("");
    setStep("verify");
  };

  const handleVerifyCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (inputCode.length !== CODE_LENGTH) {
      setError("Code must be 6 digits.");
      return;
    }

    if (inputCode !== sentCode) {
      setError("Incorrect verification code.");
      return;
    }

    setStep("success");
  };

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center py-8">
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-8">
        <h1 className="text-center text-3xl font-medium tracking-wide text-zinc-900">PROTEINBAR</h1>

        {step === "email" && (
          <form className="mt-7 space-y-4" onSubmit={handleSendCode}>
            <h2 className="text-2xl font-semibold text-zinc-900">Login</h2>
            <p className="text-sm text-zinc-600">Enter your email to receive a 6-digit verification code.</p>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-blue-600"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Continue
            </button>
          </form>
        )}

        {step === "verify" && (
          <form className="mt-7 space-y-4" onSubmit={handleVerifyCode}>
            <h2 className="text-2xl font-semibold text-zinc-900">Enter the code</h2>
            <p className="text-sm text-zinc-600">Sent to {maskedEmail}</p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              value={inputCode}
              onChange={(event) => setInputCode(event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))}
              placeholder="6-digit code"
              className="h-12 w-full rounded-xl border border-zinc-300 px-4 outline-none transition focus:border-blue-600"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="text-sm font-medium text-blue-700 underline"
            >
              Log in with a different email address
            </button>
            <p className="text-xs text-zinc-500">Demo code: {sentCode}</p>
          </form>
        )}

        {step === "success" && (
          <div className="mt-7 space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-900">Email verified</h2>
            <p className="text-sm text-zinc-600">You are now logged in as {email}.</p>
            <Link
              href="/"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
