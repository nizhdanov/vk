import { z } from 'zod';

export const genderSchema = z.enum(['female', 'male']);

export const familyStatusSchema = z.enum([
  'love',
  'married',
  'relationship',
  'searching',
  'single'
]);

export const notyficationTypeSchema = z.enum(['email', 'push']);

export const languageSchema = z.enum([
  'english',
  'spanish',
  'french',
  'german',
  'italian',
  'russian',
  'chinese'
]);

export const requiredUserFieldsSchema = z.object({
  gender: genderSchema,
  name: z.string(),
  phone: z.string(),
  surname: z.string(),
  birthDate: z.coerce.date()
});

export const optionalUserFieldsSchema = z
  .object({
    info: z.string(),
    bornCity: z.string(),
    email: z.string().email(),
    familyStatus: familyStatusSchema,
    languages: z.array(languageSchema),
    nickname: z.string(),
    notifications: z.array(notyficationTypeSchema)
  })
  .partial();

export const userSchema = requiredUserFieldsSchema.merge(optionalUserFieldsSchema);
