import { useForm as useHookForm, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodType, ZodTypeDef } from 'zod';
import { useState } from 'react';

interface UseFormConfig<TFormValues extends FieldValues> extends UseFormProps<TFormValues> {
  schema: ZodType<TFormValues, ZodTypeDef, TFormValues>;
}

export const useForm = <TFormValues extends FieldValues>({
  schema,
  ...formConfig
}: UseFormConfig<TFormValues>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useHookForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit.bind(form);

  const onSubmit = async (
    handler: (values: TFormValues) => Promise<void> | void
  ) => {
    return handleSubmit(async (values) => {
      try {
        setIsSubmitting(true);
        await handler(values);
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return {
    ...form,
    isSubmitting,
    onSubmit,
  };
};

export type UseFormReturn = ReturnType<typeof useForm>; 