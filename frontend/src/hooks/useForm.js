import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

export const useForm = ({ schema, ...formConfig }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useHookForm({
    ...formConfig,
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit.bind(form);

  const onSubmit = async (handler) => {
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