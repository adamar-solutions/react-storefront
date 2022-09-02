import { useMessageFormatter } from "@react-aria/i18n";
import russian from "@/checkout-storefront/lib/translations/ru-KZ.json";

export type MessageKey = keyof typeof russian;

export const useFormattedMessages = () => {
  const formatMessage = useMessageFormatter({ "ru-KZ": russian });

  return (messageKey: MessageKey, values?: Record<string, string | number>) =>
    formatMessage(messageKey, values);
};
