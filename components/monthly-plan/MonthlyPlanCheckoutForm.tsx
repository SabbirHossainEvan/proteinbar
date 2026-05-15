"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import type { MonthlyPlan } from "@/data/monthlyPlans";
import { mapApiLocation } from "@/lib/api-mappers";
import {
  useCheckoutMutation,
  useGetCurrentCustomerQuery,
  useGetLocationsQuery,
  useValidatePromoCodeMutation,
} from "@/redux/api/publicApi";
import type {
  DeliveryOptionId,
  MonthlyPlanDetails,
} from "@/types/monthlyPlanFlow";

type CheckoutSelection = {
  meals: string;
  days: string;
  weeks?: string;
  snacks: string;
  startDate: string;
  deliveryDays?: string;
  planType?: string;
  selectedMeals?: string;
};

type MonthlyPlanCheckoutFormProps = {
  plan: MonthlyPlan;
  selection: CheckoutSelection;
  planDetails?: MonthlyPlanDetails;
};

type DeliveryOptionConfig = {
  id: DeliveryOptionId;
  label: string;
  details: string;
};

type SelectedMealOption = {
  instanceId?: string;
  id: string;
  title: string;
  date?: string;
  extrasSummary?: string;
  calories?: number;
  protein?: number;
  carb?: number;
  fat?: number;
  basePrice?: number;
  totalPrice?: number;
};

type AppliedPromoCode = {
  code: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  discountAmount: number;
  maxDiscount: number | null;
  eligibilityNote: string;
};

type CmiPaymentResponse = {
  gatewayUrl: string;
  method: "POST";
  fields: Record<string, string>;
};

const deliveryOptions: DeliveryOptionConfig[] = [
  {
    id: "daily-delivery",
    label: "Daily Delivery",
    details: "Meals are delivered daily to your address.",
  },
  {
    id: "daily-pickup",
    label: "Daily Pickup",
    details: "Meals are picked up daily from a selected pickup location.",
  },
  {
    id: "weekly-delivery",
    label: "One-Time Weekly Delivery",
    details: "All meals for the week are delivered once to your address.",
  },
  {
    id: "weekly-pickup",
    label: "One-Time Weekly Pickup",
    details:
      "All meals for the week are picked up once from a selected pickup location.",
  },
];

const deliveryOptionDescriptions: Record<DeliveryOptionId, string> = {
  "daily-delivery": "Meals are delivered daily to your address.",
  "daily-pickup": "Meals are picked up daily from a selected pickup location.",
  "weekly-delivery":
    "All meals for the week are delivered once to your address.",
  "weekly-pickup":
    "All meals for the week are picked up once from a selected pickup location.",
};

const moroccoStates = [
  "Casablanca-Settat",
  "Rabat-Sale-Kenitra",
  "Marrakesh-Safi",
  "Fes-Meknes",
  "Tangier-Tetouan-Al Hoceima",
  "Souss-Massa",
  "Oriental",
  "Beni Mellal-Khenifra",
  "Draa-Tafilalet",
  "Guelmim-Oued Noun",
  "Laayoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
];

function toNumber(value: string, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function computeBasePrice(
  selection: CheckoutSelection,
  planDetails?: MonthlyPlanDetails,
) {
  const meals = toNumber(selection.meals, 1);
  const days = toNumber(selection.days, 7);
  const snacks = toNumber(selection.snacks, 0);
  const baseFee = Number(planDetails?.pricing?.basePriceFormula?.baseFee ?? 0);
  const pricePerMeal = Number(
    planDetails?.pricing?.basePriceFormula?.pricePerMeal ?? 18,
  );
  const dayMultiplier = Number(
    planDetails?.pricing?.basePriceFormula?.dayMultiplier ?? 1,
  );
  const snacksAddonPrice = Number(planDetails?.pricing?.snacksAddonPrice ?? 8);

  return (
    baseFee +
    meals * days * pricePerMeal * dayMultiplier +
    snacks * days * snacksAddonPrice
  );
}

function isDeliveryOption(option: DeliveryOptionId | "") {
  return option === "daily-delivery" || option === "weekly-delivery";
}

function isPickupOption(option: DeliveryOptionId | "") {
  return option === "daily-pickup" || option === "weekly-pickup";
}

function parseSelectedMeals(value?: string): SelectedMealOption[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        instanceId: item?.instanceId ? String(item.instanceId) : undefined,
        id: String(item?.id ?? ""),
        title: String(item?.title ?? ""),
        date: item?.date ? String(item.date) : undefined,
        extrasSummary: item?.extrasSummary ? String(item.extrasSummary) : undefined,
        calories: Number(item?.calories ?? 0),
        protein: Number(item?.protein ?? 0),
        carb: Number(item?.carb ?? 0),
        fat: Number(item?.fat ?? 0),
        basePrice: Number(item?.basePrice ?? 0),
        totalPrice: Number(item?.totalPrice ?? 0),
      }))
      .filter((item) => item.id && item.title);
  } catch {
    return [];
  }
}

export default function MonthlyPlanCheckoutForm({
  plan,
  selection,
  planDetails,
}: MonthlyPlanCheckoutFormProps) {
  const [giftCode, setGiftCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] =
    useState<AppliedPromoCode | null>(null);
  const [promoFeedback, setPromoFeedback] = useState("");
  const [promoError, setPromoError] = useState("");
  const [cutlery, setCutlery] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [emirate, setEmirate] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOptionId | "">(
    "",
  );
  const [pickupLocationId, setPickupLocationId] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const { data: locationsResponse } = useGetLocationsQuery();
  const [validatePromoCode, { isLoading: isValidatingPromoCode }] =
    useValidatePromoCodeMutation();
  const [checkout, { isLoading }] = useCheckoutMutation();
  const { data: currentCustomer } = useGetCurrentCustomerQuery();

  const locations = (locationsResponse?.data ?? []).map(mapApiLocation);
  const rules = planDetails?.rules;
  const selectedMeals = useMemo(
    () => parseSelectedMeals(selection.selectedMeals),
    [selection.selectedMeals]
  );

  const enabledDeliveryOptions = useMemo(() => {
    const fromRules =
      rules?.deliveryOptionConfigs?.filter((option) => option.enabled) ?? [];
    if (fromRules.length > 0) {
      return fromRules.map((option) => ({
        id: option.option,
        label: option.label,
        details: deliveryOptionDescriptions[option.option] ?? option.label,
      }));
    }

    return deliveryOptions;
  }, [rules]);
  const effectiveDeliveryOption =
    deliveryOption &&
    enabledDeliveryOptions.some((item) => item.id === deliveryOption)
      ? deliveryOption
      : (enabledDeliveryOptions[0]?.id ?? "");

  const subtotal = useMemo(
    () => computeBasePrice(selection, planDetails),
    [planDetails, selection],
  );
  const giftDiscount = useMemo(() => {
    return appliedPromoCode?.discountAmount ?? 0;
  }, [appliedPromoCode]);
  const pricing = planDetails?.pricing;
  const vatPercent = Number(pricing?.vatPercent ?? 5);
  const vat = ((subtotal - giftDiscount) * vatPercent) / 100;
  const safetyBagFee = Number(pricing?.safetyBagFee ?? 5);
  const safetyBag = cutlery ? safetyBagFee : 0;
  const grandTotal = subtotal - giftDiscount + vat + safetyBag;

  const needsAddress = isDeliveryOption(effectiveDeliveryOption);
  const needsPickupLocation = isPickupOption(effectiveDeliveryOption);
  const accountEmail = currentCustomer?.data?.user?.email?.trim() ?? "";
  const effectiveEmail = accountEmail;

  async function handleApplyPromoCode() {
    setPromoError("");
    setPromoFeedback("");

    if (!giftCode.trim()) {
      setAppliedPromoCode(null);
      setPromoError("Enter a promo code first.");
      return;
    }

    try {
      const response = await validatePromoCode({
        code: giftCode.trim(),
        subtotal,
        scope: "monthly-plan",
      }).unwrap();

      setAppliedPromoCode(response.data);
      setGiftCode(response.data.code);
      setPromoFeedback(
        `${response.data.code} applied. Discount: ${response.data.discountAmount.toFixed(2)} MAD.`,
      );
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? String(
              (error as { data?: { message?: string } }).data?.message ??
                "Promo code is invalid.",
            )
          : "Promo code is invalid.";
      setAppliedPromoCode(null);
      setPromoError(message);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (
      !effectiveDeliveryOption ||
      !enabledDeliveryOptions.some(
        (option) => option.id === effectiveDeliveryOption,
      )
    ) {
      setSubmitError("Please select a delivery option.");
      return;
    }

    if (!firstName || !lastName || !effectiveEmail || !phone || !emirate || !area) {
      setSubmitError("Please fill all required customer fields.");
      return;
    }

    if (needsAddress && !address.trim()) {
      setSubmitError("Address is required for delivery options.");
      return;
    }

    if (needsPickupLocation && !pickupLocationId) {
      setSubmitError("Pickup location is required for pickup options.");
      return;
    }

    if (!acceptedTerms) {
      setSubmitError("You must accept the terms before checkout.");
      return;
    }

    const pickupLocation = locations.find(
      (location) => location.id === pickupLocationId,
    );

    if (needsPickupLocation && !pickupLocation) {
      setSubmitError("Please choose a valid pickup location.");
      return;
    }

    const delivery = {
      optionId: effectiveDeliveryOption,
      address: needsAddress ? address.trim() : undefined,
      pickupLocation: pickupLocation
        ? {
            id: pickupLocation.id,
            name: pickupLocation.name,
            address: pickupLocation.address,
          }
        : undefined,
    };

    try {
      const response = await checkout({
        subscription: {
          plan: {
            id: plan.id,
            title: plan.title,
          },
          selection: {
            ...selection,
            selectedMeals,
          },
          delivery,
        },
        order: {
          customer: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: effectiveEmail,
            phone: phone.trim(),
            emirate,
            area: area.trim(),
          },
          selectedMeals,
          promoCode: appliedPromoCode
            ? {
                code: appliedPromoCode.code,
              }
            : undefined,
          delivery,
          totals: {
            subtotal,
            giftDiscount,
            vat,
            safetyBag,
            grandTotal,
          },
        },
      }).unwrap();
      const payment = response.data?.payment as CmiPaymentResponse | undefined;

      if (!payment?.gatewayUrl || !payment?.fields) {
        throw new Error("CMI payment payload was not returned.");
      }

      setSubmitSuccess("Redirecting to the secure CMI payment page...");

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
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? String(
              (error as { data?: { message?: string } }).data?.message ??
                "Failed to complete checkout.",
            )
          : "Failed to complete checkout.";
      setSubmitError(message);
    }
  }

  return (
    <section className="bg-zinc-100 py-10 sm:py-14">
      <h2 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
        Checkout
      </h2>

      <div className="mt-8 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-sm border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border border-zinc-200">
            {plan.image && (
              <Image
                src={plan.image}
                alt={plan.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <h3 className="mt-4 text-center text-2xl font-bold text-zinc-900">
            {plan.title}
          </h3>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Selected Plan
          </p>
          <div className="mt-4 space-y-1 text-center text-sm text-zinc-700">
            {selection.planType ? <p>Plan Type: {selection.planType}</p> : null}
            <p>Meals: {selection.meals}</p>
            {!selection.weeks ? <p>Days: {selection.days}</p> : null}
            {selection.weeks ? <p>Weeks: {selection.weeks}</p> : null}
            <p>Snacks: {selection.snacks}</p>
            <p>Start: {selection.startDate}</p>
          </div>
        </aside>

        <div className="rounded-sm border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-3xl font-bold text-zinc-900">Gift Code</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px]">
            <input
              type="text"
              value={giftCode}
              onChange={(event) => {
                setGiftCode(event.target.value);
                setAppliedPromoCode(null);
                setPromoError("");
                setPromoFeedback("");
              }}
              placeholder="Enter Gift Code"
              className="h-12 rounded-lg border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-800 outline-none focus:border-zinc-500"
            />
            <button
              type="button"
              onClick={() => void handleApplyPromoCode()}
              className="h-12 rounded-sm bg-black px-6 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              {isValidatingPromoCode ? "Checking..." : "Apply"}
            </button>
          </div>
          {promoError ? (
            <p className="mt-3 text-sm text-red-600">{promoError}</p>
          ) : null}
          {promoFeedback ? (
            <p className="mt-3 text-sm font-medium text-emerald-700">
              {promoFeedback}
            </p>
          ) : null}
          {appliedPromoCode?.eligibilityNote ? (
            <p className="mt-2 text-xs text-zinc-500">
              {appliedPromoCode.eligibilityNote}
            </p>
          ) : null}

          <div className="mt-5 border-t border-zinc-200 pt-4 text-sm">
            <div className="flex items-center justify-between py-2">
              <span>Total</span>
              <span className="font-semibold">
                {subtotal.toFixed(2)}{" "}
                <span className="text-xs text-zinc-500">MAD</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Code</span>
              <span className="font-semibold">
                -{giftDiscount.toFixed(2)}{" "}
                <span className="text-xs text-zinc-500">MAD</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Vat</span>
              <span className="font-semibold">
                {vat.toFixed(2)}{" "}
                <span className="text-xs text-zinc-500">MAD</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Safety Bag</span>
              <span className="font-semibold">
                {safetyBag.toFixed(2)}{" "}
                <span className="text-xs text-zinc-500">MAD</span>
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-zinc-200 py-3 text-base">
              <span className="font-semibold">Grand Total</span>
              <span className="font-bold text-black">
                {grandTotal.toFixed(2)}{" "}
                <span className="text-xs text-zinc-500">MAD</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-3xl font-semibold text-zinc-900">Checkout Form</h3>

        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">
                First Name
              </label>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                value={effectiveEmail}
                readOnly
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">State</label>
              <select
                value={emirate}
                onChange={(event) => setEmirate(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              >
                <option value="">Choose State</option>
                {moroccoStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Area</label>
              <input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
            <p className="text-base font-semibold text-zinc-900">
              Delivery Option
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              Choose how you want to receive your meal plan.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {enabledDeliveryOptions.map((option) => {
                const active = effectiveDeliveryOption === option.id;
                return (
                  <label
                    key={option.id}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      active
                        ? "border-black bg-black text-white"
                        : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryOption"
                      value={option.id}
                      checked={active}
                      onChange={(event) => {
                        const nextOption = event.target
                          .value as DeliveryOptionId;
                        setDeliveryOption(nextOption);
                        if (isDeliveryOption(nextOption)) {
                          setPickupLocationId("");
                        }
                        if (isPickupOption(nextOption)) {
                          setAddress("");
                        }
                      }}
                      className="sr-only"
                    />
                    <p className="text-sm font-semibold">{option.label}</p>
                    <p
                      className={`mt-1 text-xs ${
                        active ? "text-white/90" : "text-zinc-500"
                      }`}
                    >
                      {option.details}
                    </p>
                  </label>
                );
              })}
            </div>

            {needsAddress ? (
              <div className="mt-4">
                <label className="text-sm font-medium text-zinc-700">
                  Delivery Address
                </label>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-500"
                  placeholder="Enter your delivery address"
                />
              </div>
            ) : null}

            {needsPickupLocation ? (
              <div className="mt-4">
                <label className="text-sm font-medium text-zinc-700">
                  Pickup Location
                </label>
                <select
                  value={pickupLocationId}
                  onChange={(event) => setPickupLocationId(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-500"
                >
                  <option value="">Choose pickup location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          <div className="mt-5 space-y-2 text-sm text-zinc-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={cutlery}
                onChange={(event) => setCutlery(event.target.checked)}
              />
              Cutlery
            </label>
            <p className="text-zinc-500">
              Secure card payments are processed by CMI.
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span>
                I accepted the{" "}
                <Link
                  href="/pages/terms-and-conditions"
                  className="text-zinc-900 underline underline-offset-4"
                >
                  Terms and Conditions
                </Link>{" "}
                of the meals plan
              </span>
            </label>
          </div>

          {submitError ? (
            <p className="mt-4 text-sm text-red-600">{submitError}</p>
          ) : null}
          {submitSuccess ? (
            <p className="mt-4 text-sm font-medium text-emerald-700">
              {submitSuccess}
            </p>
          ) : null}

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 min-w-44 items-center justify-center rounded-sm bg-black px-8 text-base font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {isLoading ? "Preparing Payment..." : "Pay with CMI"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
