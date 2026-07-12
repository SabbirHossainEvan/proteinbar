"use client";

import { useState } from "react";
import { useRetryCmiPaymentMutation } from "@/redux/api/publicApi";

type CmiRetryPaymentButtonProps = {
  orderId: string;
  retryToken: string;
};

function getApiErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    return data?.message || "Unable to retry payment.";
  }

  return "Unable to retry payment.";
}

export default function CmiRetryPaymentButton({
  orderId,
  retryToken,
}: CmiRetryPaymentButtonProps) {
  const [retryPayment, { isLoading }] = useRetryCmiPaymentMutation();
  const [error, setError] = useState("");

  const handleRetry = async () => {
    setError("");

    try {
      const response = await retryPayment({ orderId, retryToken }).unwrap();
      const payment = response.data?.payment;

      if (!payment?.gatewayUrl || !payment?.fields) {
        throw new Error("CMI payment payload was not returned.");
      }

      const form = document.createElement("form");
      form.method = payment.method || "POST";
      form.action = payment.gatewayUrl;
      form.style.display = "none";

      Object.entries(payment.fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value ?? "");
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : getApiErrorMessage(issue),
      );
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void handleRetry()}
        disabled={isLoading}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Preparing secure payment..." : "Try payment again"}
      </button>
      {error ? <p className="max-w-md text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
