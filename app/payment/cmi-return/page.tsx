import Link from "next/link";
import CmiRetryPaymentButton from "@/components/payments/CmiRetryPaymentButton";

type PaymentResultPageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

function readParam(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (Array.isArray(value)) return String(value[0] ?? fallback);
  return String(value ?? fallback);
}

export default async function CmiReturnPage({
  searchParams,
}: PaymentResultPageProps) {
  const params = searchParams ? await searchParams : {};
  const status = readParam(params.status, "failed").toLowerCase();
  const isSuccess = status === "success";
  const orderId = readParam(params.orderId);
  const subscriptionId = readParam(params.subscriptionId);
  const amount = readParam(params.amount);
  const retryToken = readParam(params.retryToken);
  const message = readParam(
    params.message,
    isSuccess
      ? "Your payment was confirmed successfully."
      : "Your bank could not complete the secure card authentication. You were not charged. Please try again.",
  );
  const canRetry = !isSuccess && orderId && retryToken;

  return (
    <section className="mx-auto max-w-3xl py-16 sm:py-24">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          CMI Payment
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          {isSuccess ? "Payment Confirmed" : "Payment Not Completed"}
        </h1>
        <p className="mt-4 text-base text-zinc-600">{message}</p>
        {!isSuccess ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-semibold">No charge was confirmed for this attempt.</p>
            <p className="mt-1">
              If this was a temporary 3D Secure or bank authentication issue, you can safely retry the same order.
            </p>
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl bg-zinc-100 p-5 text-sm text-zinc-700">
          <p>
            Order ID:{" "}
            <span className="font-semibold text-zinc-900">
              {orderId || "N/A"}
            </span>
          </p>
          <p className="mt-2">
            Subscription ID:{" "}
            <span className="font-semibold text-zinc-900">
              {subscriptionId || "N/A"}
            </span>
          </p>
          {amount ? (
            <p className="mt-2">
              Amount:{" "}
              <span className="font-semibold text-zinc-900">
                {amount} MAD
              </span>
            </p>
          ) : null}
          <p className="mt-2">
            Status:{" "}
            <span
              className={`font-semibold ${
                isSuccess ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {isSuccess ? "Success" : "Failed"}
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {canRetry ? (
            <CmiRetryPaymentButton orderId={orderId} retryToken={retryToken} />
          ) : null}
          {!isSuccess && !canRetry ? (
            <Link
              href="/mealprep"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Start checkout again
            </Link>
          ) : null}
          {isSuccess ? (
            <Link
              href="/mealprep"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Back to Plans
            </Link>
          ) : null}
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-300 px-5 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
