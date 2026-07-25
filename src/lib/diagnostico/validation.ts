import { PHONE_REGEX, URL_REGEX, type StepConfig } from "./config";

type Answers = Record<string, unknown>;

export function isStepValid(step: StepConfig, answers: Answers): boolean {
  if (step.type === "multi") {
    if (!step.required) return true;
    const v = answers[step.id];
    return Array.isArray(v) && v.length > 0;
  }
  if (step.type === "text" || step.type === "textarea") {
    const val = ((answers[step.id] as string) || "").toString().trim();
    if (step.id === "urlWeb") {
      if (!val) return true;
      return URL_REGEX.test(val);
    }
    if (!step.required && !val) return true;
    const min = step.minLength || 2;
    return val.length >= min;
  }
  if (step.type === "tel") {
    const val = ((answers[step.id] as string) || "").toString().trim();
    if (!step.required && !val) return true;
    return PHONE_REGEX.test(val);
  }
  if (step.type === "file") return true;
  if (!step.required) return true;
  const v = answers[step.id];
  return v !== undefined && v !== "" && v !== null;
}
