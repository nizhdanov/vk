import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormFieldsGenerator } from '@/components/form-fields-generator';
import { requiredUserFieldsSchema } from '@/schemas';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';

import { useStage } from './contexts/stage';
import { useUser } from './contexts/user';

export function RequiredFieldsForm() {
  const { setStage } = useStage();

  const { setUser } = useUser();

  const form = useForm<z.infer<typeof requiredUserFieldsSchema>>({
    resolver: zodResolver(requiredUserFieldsSchema)
  });
  function onSubmit(values: z.infer<typeof requiredUserFieldsSchema>) {
    setUser(values);
    setStage('optional');
  }

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
        <FormFieldsGenerator schema={requiredUserFieldsSchema} form={form} />

        <Button type='submit'>Далее</Button>
      </form>
    </Form>
  );
}
