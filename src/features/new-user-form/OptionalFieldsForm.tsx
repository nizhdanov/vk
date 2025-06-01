import type { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { usePostCreateMutation } from '@/api/hooks';
import { QUERY_KEY } from '@/api/queryKey';
import { FormFieldsGenerator } from '@/components/form-fields-generator';
import { optionalUserFieldsSchema } from '@/schemas';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';

import { useStage } from './contexts/stage';
import { useUser } from './contexts/user';

export function OptionalFieldsForm() {
  const { setStage } = useStage();

  const { user } = useUser();

  const queryClient = useQueryClient();

  const createUserMutation = usePostCreateMutation({
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] });
      }
    }
  });

  const form = useForm<z.infer<typeof optionalUserFieldsSchema>>({
    resolver: zodResolver(optionalUserFieldsSchema)
  });

  async function onSubmit(values: z.infer<typeof optionalUserFieldsSchema>) {
    await createUserMutation.mutateAsync({
      data: {
        ...user!,
        ...values
      }
    });
  }

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
        <FormFieldsGenerator schema={optionalUserFieldsSchema} form={form} />

        <div>
          <Button type='button' onClick={() => setStage('required')}>
            Назад
          </Button>
          <Button type='submit'>Далее</Button>
        </div>
      </form>
    </Form>
  );
}
