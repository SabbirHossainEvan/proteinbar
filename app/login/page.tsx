"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetCurrentCustomerQuery,
  useSendCodeMutation,
  useVerifyCodeMutation
} from "@/redux/api/publicApi";

const CODE_LENGTH = 6;
const CUSTOMER_RETURN_TO_KEY = "proteinbar_customer_return_to";
const CUSTOMER_SESSION_COOKIE_NAME = "proteinbar_customer_session";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0] ?? ""}*@${domain}`;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

function normalizeReturnTo(returnTo: string | null) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }

  return returnTo;
}

function setCustomerSessionCookie(token: string, expiresAt: string) {
  if (typeof document === "undefined" || !token) return;

  const expires = new Date(expiresAt);
  const cookieParts = [
    `${CUSTOMER_SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "SameSite=Lax",
  ];

  if (!Number.isNaN(expires.getTime())) {
    cookieParts.push(`Expires=${expires.toUTCString()}`);
  }

  if (window.location.protocol === "https:") {
    cookieParts.push("Secure");
  }

  document.cookie = cookieParts.join("; ");
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [storedReturnTo] = useState(() => {
    if (typeof window === "undefined") return "/";
    return normalizeReturnTo(
      window.sessionStorage.getItem(CUSTOMER_RETURN_TO_KEY)
    );
  });
  const queryReturnTo = normalizeReturnTo(searchParams.get("returnTo"));
  const returnTo = queryReturnTo !== "/" ? queryReturnTo : storedReturnTo;

  const [sendCode, { isLoading: sending }] = useSendCodeMutation();
  const [verifyCode, { isLoading: verifying }] = useVerifyCodeMutation();
  const { data: currentCustomer, refetch } = useGetCurrentCustomerQuery();

  const maskedEmail = useMemo(() => maskEmail(email), [email]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.sessionStorage.setItem(CUSTOMER_RETURN_TO_KEY, returnTo);
  }, [returnTo]);

  useEffect(() => {
    if (currentCustomer?.data?.user?.email) {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(CUSTOMER_RETURN_TO_KEY);
      }
      router.replace(returnTo);
    }
  }, [currentCustomer, returnTo, router]);

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await sendCode({ email: normalizedEmail }).unwrap();
      setEmail(normalizedEmail);
      setInputCode("");
      setStep("verify");
    } catch {
      setError("Failed to send verification code.");
    }
  };

  const handleVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (inputCode.length !== CODE_LENGTH) {
      setError("Code must be 6 digits.");
      return;
    }

    try {
      const response = await verifyCode({ email, code: inputCode }).unwrap();
      const session = response?.data?.session;
      if (session?.token && session?.expiresAt) {
        setCustomerSessionCookie(session.token, session.expiresAt);
      }
      await refetch();
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(CUSTOMER_RETURN_TO_KEY);
        window.location.replace(returnTo);
        return;
      }
      router.replace(returnTo);
    } catch {
      setError("Incorrect or expired verification code.");
    }
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
              disabled={sending}
              className="h-11 w-full rounded-xl bg-black text-base font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Continue"}
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
              disabled={verifying}
              className="h-11 w-full rounded-xl bg-black text-base font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {verifying ? "Verifying..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError("");
              }}
              className="text-sm font-medium text-black underline"
            >
              Log in with a different email address
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
