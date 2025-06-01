import type { z } from 'zod';

import type {
  familyStatusSchema,
  genderSchema,
  notyficationTypeSchema,
  optionalUserFieldsSchema,
  requiredUserFieldsSchema
} from '@/schemas';

export type FamilyStatus = z.infer<typeof familyStatusSchema>;

export type Gender = z.infer<typeof genderSchema>;

export type NotyficationType = z.infer<typeof notyficationTypeSchema>;

export type OptionalUserFieldsSchema = z.infer<typeof optionalUserFieldsSchema>;

export type OptionalUserFields = OptionalUserFieldsSchema & {
  friendsCount: number;
};

export type RequiredUserFieldsSchema = z.infer<typeof requiredUserFieldsSchema>;

export type RequiredUserFields = RequiredUserFieldsSchema & {
  id: number;
  registeredAt: string;
};

export type User = RequiredUserFields & OptionalUserFields;

export type UserSchema = RequiredUserFieldsSchema & OptionalUserFieldsSchema;
