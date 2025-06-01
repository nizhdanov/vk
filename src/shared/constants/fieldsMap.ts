import type { User } from '@/types';

export const FIELDS_MAP: Record<keyof User, string> = {
  name: 'Имя',
  email: 'Email',
  info: 'Информация',
  friendsCount: 'Количество друзей',
  id: 'ID',
  birthDate: 'Дата рождения',
  phone: 'Телефон',
  registeredAt: 'Дата регистрации',
  surname: 'Фамилия',
  nickname: 'Псевдоним',
  familyStatus: 'Семейное положение',
  notifications: 'Уведомления',
  languages: 'Языки',
  bornCity: 'Город рождения',
  gender: 'Пол'
} as const;
