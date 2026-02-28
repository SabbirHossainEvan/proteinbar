"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!/^[\d+\-\s()]{7,}$/.test(values.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.message.trim()) {
    errors.message = "Please write your message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitted(false);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
    setValues(initialState);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={onChange}
          className="h-14 w-full border border-zinc-300 bg-transparent px-5 text-base text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 sm:text-lg"
          placeholder="Name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
      </div>
      <div>
        <input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={onChange}
          className="h-14 w-full border border-zinc-300 bg-transparent px-5 text-base text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 sm:text-lg"
          placeholder="Phone Number"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        )}
      </div>
      <div>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          className="h-14 w-full border border-zinc-300 bg-transparent px-5 text-base text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 sm:text-lg"
          placeholder="Email"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
      </div>
      <div>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={onChange}
          rows={6}
          className="w-full border border-zinc-300 bg-transparent px-5 py-4 text-base text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 sm:text-lg"
          placeholder="Message"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="h-14 min-w-32 bg-zinc-900 px-8 text-base font-medium text-white transition hover:bg-black sm:text-lg"
        >
          Submit
        </button>
        {submitted && (
          <p className="text-sm text-emerald-700">
            Message received. We will contact you shortly.
          </p>
        )}
      </div>
    </form>
  );
}
