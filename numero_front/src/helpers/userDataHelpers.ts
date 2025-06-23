import { type User } from '@telegram-apps/sdk-react';
import { type DisplayDataRow } from '@/components/DisplayData/DisplayData';

export const getUserRows = (user: User): DisplayDataRow[] => {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
};

export const getChatRows = (chat: { id: number; title: string; type: string; username?: string; photoUrl?: string }): DisplayDataRow[] => {
  return [
    { title: 'id', value: chat.id.toString() },
    { title: 'title', value: chat.title },
    { title: 'type', value: chat.type },
    { title: 'username', value: chat.username },
    { title: 'photo_url', value: chat.photoUrl },
  ];
}; 