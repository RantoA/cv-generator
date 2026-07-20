import { useEffect, useRef } from "react";
import { useForm, type FieldValues, type UseFormProps, type UseFormReturn } from "react-hook-form";

interface UseLiveFormOptions<T extends FieldValues> extends UseFormProps<T> {
  onChange: (values: T) => void;
}

/**
 * Formulaire React Hook Form qui répercute chaque changement de valeur au parent (aperçu temps réel).
 * `onChange` est lu via une ref pour toujours refléter la dernière closure sans resouscrire à `watch`.
 */
export function useLiveForm<T extends FieldValues>({ onChange, ...formOptions }: UseLiveFormOptions<T>): UseFormReturn<T> {
  const form = useForm<T>(formOptions);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const subscription = form.watch((values) => onChangeRef.current(values as T));
    return () => subscription.unsubscribe();
  }, [form]);

  return form;
}
