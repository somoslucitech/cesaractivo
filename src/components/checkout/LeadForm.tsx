"use client";

import { useState, type FormEvent } from "react";
import { leadSchema } from "@/lib/schemas";

interface LeadFormProps {
  onCreated: (lead: { id: string; name: string }) => void;
}

export function LeadForm({ onCreated }: LeadFormProps) {
  const [values, setValues] = useState({ name: "", email: "", whatsapp: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = leadSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { leadId: string };
      onCreated({ id: data.leadId, name: parsed.data.name });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        id="name"
        label="Nombre completo"
        value={values.name}
        onChange={(v) => setValues((prev) => ({ ...prev, name: v }))}
        placeholder="Cómo te llamas"
        autoComplete="name"
        error={errors.name}
      />
      <Field
        id="email"
        type="email"
        label="Email"
        value={values.email}
        onChange={(v) => setValues((prev) => ({ ...prev, email: v }))}
        placeholder="tucorreo@ejemplo.com"
        autoComplete="email"
        error={errors.email}
      />
      <Field
        id="whatsapp"
        type="tel"
        label="WhatsApp"
        value={values.whatsapp}
        onChange={(v) => setValues((prev) => ({ ...prev, whatsapp: v }))}
        placeholder="+58 412 1234567"
        autoComplete="tel"
        error={errors.whatsapp}
      />

      {status === "error" && (
        <p className="text-sm text-error" role="alert">
          No pudimos guardar tus datos. Intenta de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-full bg-azul px-6 py-3 font-semibold text-blanco-calido transition-transform duration-150 ease-out active:scale-[0.97] disabled:opacity-60"
      >
        {status === "submitting" ? "Guardando..." : "Continuar al pago"}
      </button>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  type?: string;
  error?: string;
}

function Field({ id, label, value, onChange, placeholder, autoComplete, type = "text", error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-tinta">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="rounded-xl border border-linea bg-superficie px-4 py-2.5 text-tinta placeholder:text-tinta-suave focus:border-azul-texto focus:outline-none focus:ring-2 focus:ring-tinte-azul"
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
