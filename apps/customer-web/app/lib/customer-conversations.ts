import type {
  InboundMessageSummary,
  MessageStatus,
  OutboundMessageSummary,
} from '@elite-message/contracts';
import type { CustomerLocale } from './customer-locale';
import { translateCustomerEnum } from './customer-locale';

export type CustomerConversationEvent = {
  id: string;
  direction: 'inbound' | 'outbound';
  instanceId: string;
  instancePublicId: string;
  contactId: string;
  contactLabel: string;
  preview: string;
  kind: string;
  status?: MessageStatus;
  ack?: string;
  errorMessage?: string | null;
  timestamp: string;
  source: InboundMessageSummary | OutboundMessageSummary;
};

export type CustomerConversation = {
  id: string;
  contactId: string;
  contactLabel: string;
  instanceId: string;
  instancePublicId: string;
  lastActivityAt: string;
  lastPreview: string;
  inboundCount: number;
  outboundCount: number;
  queuedCount: number;
  sentCount: number;
  failedCount: number;
  events: CustomerConversationEvent[];
};

export type CustomerContact = {
  id: string;
  label: string;
  address: string;
  instancePublicIds: string[];
  conversationIds: string[];
  lastActivityAt: string;
  lastPreview: string;
  inboundCount: number;
  outboundCount: number;
  failedCount: number;
};

type CustomerTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export type CustomerOutboundDeliveryView = {
  label: string;
  tone: CustomerTone;
  detail: string;
  showAck: boolean;
};

function getTimestampValue(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeCustomerContactAddress(value: string) {
  const trimmed = value.trim();
  const withoutWhatsAppSuffix = trimmed.replace(
    /@(c\.us|s\.whatsapp\.net|g\.us)$/i,
    '',
  );
  const compact = withoutWhatsAppSuffix.replace(/[^\dA-Za-z+_-]/g, '');

  return compact || trimmed || 'unknown';
}

export function getCustomerContactInitial(value: string) {
  return normalizeCustomerContactAddress(value).charAt(0).toUpperCase() || '#';
}

export function getOutboundMessagePreview(
  message: OutboundMessageSummary,
  fallback: string,
) {
  const preview =
    message.body?.trim() ||
    message.caption?.trim() ||
    message.mediaUrl?.trim() ||
    '';

  return preview || fallback;
}

export function getInboundMessagePreview(
  message: InboundMessageSummary,
  fallback: string,
) {
  const preview = message.body?.trim() || message.mediaUrl?.trim() || '';

  return preview || fallback;
}

export function getCustomerOutboundDeliveryView(
  message: OutboundMessageSummary,
  locale: CustomerLocale,
): CustomerOutboundDeliveryView {
  if (message.status === 'queue') {
    const scheduledAt = Date.parse(message.scheduledFor);
    const isScheduledForLater =
      Number.isFinite(scheduledAt) && scheduledAt > Date.now() + 5_000;
    const isBeingProcessed = Boolean(
      message.processingWorkerId || message.workerId,
    );

    if (isScheduledForLater) {
      return {
        label: locale === 'ar' ? 'مجدولة للإرسال' : 'Scheduled to send',
        tone: 'info',
        detail:
          locale === 'ar'
            ? 'سيتم إرسال الرسالة تلقائياً في موعدها.'
            : 'This message will send automatically at its scheduled time.',
        showAck: false,
      };
    }

    if (isBeingProcessed) {
      return {
        label: locale === 'ar' ? 'جارٍ الإرسال' : 'Sending',
        tone: 'warning',
        detail:
          locale === 'ar'
            ? 'واتساب يعالج هذه الرسالة الآن.'
            : 'WhatsApp is processing this message now.',
        showAck: false,
      };
    }

    return {
      label: locale === 'ar' ? 'يتم التحضير للإرسال' : 'Preparing to send',
      tone: 'warning',
      detail:
        locale === 'ar'
          ? 'سنرسل الرسالة تلقائياً عندما يصبح الاتصال جاهزاً.'
          : 'We will send this automatically as soon as the connection is ready.',
      showAck: false,
    };
  }

  if (message.status === 'sent') {
    return {
      label: translateCustomerEnum(locale, 'sent'),
      tone: 'success',
      detail:
        message.ack === 'pending'
          ? locale === 'ar'
            ? 'تم الإرسال وننتظر تأكيد التسليم من واتساب.'
            : 'Sent, waiting for WhatsApp delivery confirmation.'
          : locale === 'ar'
            ? `تأكيد التسليم: ${translateCustomerEnum(locale, message.ack)}.`
            : `Delivery confirmation: ${translateCustomerEnum(locale, message.ack)}.`,
      showAck: message.ack !== 'pending',
    };
  }

  if (message.status === 'unsent') {
    return {
      label: locale === 'ar' ? 'تحتاج متابعة' : 'Needs attention',
      tone: 'danger',
      detail:
        locale === 'ar'
          ? 'لم يتم إرسال الرسالة. يمكنك إعادة المحاولة بعد التأكد من اتصال واتساب.'
          : 'The message was not sent. You can retry after WhatsApp is connected.',
      showAck: false,
    };
  }

  if (message.status === 'invalid') {
    return {
      label: locale === 'ar' ? 'رسالة غير صالحة' : 'Invalid message',
      tone: 'danger',
      detail:
        locale === 'ar'
          ? 'راجع رقم المستلم أو محتوى الرسالة ثم أرسلها من جديد.'
          : 'Check the recipient or message content, then send it again.',
      showAck: false,
    };
  }

  if (message.status === 'expired') {
    return {
      label: translateCustomerEnum(locale, 'expired'),
      tone: 'danger',
      detail:
        locale === 'ar'
          ? 'انتهت صلاحية هذه الرسالة قبل إرسالها.'
          : 'This message expired before it could be sent.',
      showAck: false,
    };
  }

  return {
    label: translateCustomerEnum(locale, message.status),
    tone: 'neutral',
    detail: translateCustomerEnum(locale, message.status),
    showAck: false,
  };
}

export function getCustomerConversationEventDeliveryView(
  event: CustomerConversationEvent,
  locale: CustomerLocale,
) {
  if (event.direction !== 'outbound' || !('recipient' in event.source)) {
    return null;
  }

  return getCustomerOutboundDeliveryView(event.source, locale);
}

export function buildCustomerConversationEvents(input: {
  outboundMessages: OutboundMessageSummary[];
  inboundMessages: InboundMessageSummary[];
  emptyPreviewLabel: string;
}) {
  const outboundEvents: CustomerConversationEvent[] =
    input.outboundMessages.map((message) => {
      const contactId = normalizeCustomerContactAddress(message.recipient);

      return {
        id: `outbound:${message.id}`,
        direction: 'outbound',
        instanceId: message.instanceId,
        instancePublicId: message.instancePublicId,
        contactId,
        contactLabel: contactId,
        preview: getOutboundMessagePreview(message, input.emptyPreviewLabel),
        kind: message.messageType,
        status: message.status,
        ack: message.ack,
        errorMessage: message.errorMessage,
        timestamp: message.sentAt ?? message.createdAt,
        source: message,
      };
    });

  const inboundEvents: CustomerConversationEvent[] = input.inboundMessages.map(
    (message) => {
      const contactId = normalizeCustomerContactAddress(
        message.sender || message.chatId || message.publicMessageId,
      );

      return {
        id: `inbound:${message.id}`,
        direction: 'inbound',
        instanceId: message.instanceId,
        instancePublicId: message.instancePublicId,
        contactId,
        contactLabel: message.pushName?.trim() || contactId,
        preview: getInboundMessagePreview(message, input.emptyPreviewLabel),
        kind: message.kind,
        timestamp: message.receivedAt,
        source: message,
      };
    },
  );

  return [...outboundEvents, ...inboundEvents].sort(
    (first, second) =>
      getTimestampValue(first.timestamp) - getTimestampValue(second.timestamp),
  );
}

export function buildCustomerConversations(
  events: CustomerConversationEvent[],
) {
  const conversations = new Map<string, CustomerConversation>();

  for (const event of events) {
    const id = `${event.instanceId}:${event.contactId}`;
    const existing = conversations.get(id);

    if (!existing) {
      conversations.set(id, {
        id,
        contactId: event.contactId,
        contactLabel: event.contactLabel,
        instanceId: event.instanceId,
        instancePublicId: event.instancePublicId,
        lastActivityAt: event.timestamp,
        lastPreview: event.preview,
        inboundCount: event.direction === 'inbound' ? 1 : 0,
        outboundCount: event.direction === 'outbound' ? 1 : 0,
        queuedCount: event.status === 'queue' ? 1 : 0,
        sentCount: event.status === 'sent' ? 1 : 0,
        failedCount: ['unsent', 'invalid', 'expired'].includes(
          event.status ?? '',
        )
          ? 1
          : 0,
        events: [event],
      });
      continue;
    }

    existing.events.push(event);
    if (
      getTimestampValue(event.timestamp) >=
      getTimestampValue(existing.lastActivityAt)
    ) {
      existing.lastActivityAt = event.timestamp;
      existing.lastPreview = event.preview;
      existing.contactLabel =
        event.contactLabel !== event.contactId
          ? event.contactLabel
          : existing.contactLabel;
    }
    if (event.direction === 'inbound') {
      existing.inboundCount += 1;
    } else {
      existing.outboundCount += 1;
    }
    if (event.status === 'queue') {
      existing.queuedCount += 1;
    }
    if (event.status === 'sent') {
      existing.sentCount += 1;
    }
    if (['unsent', 'invalid', 'expired'].includes(event.status ?? '')) {
      existing.failedCount += 1;
    }
  }

  return [...conversations.values()].sort(
    (first, second) =>
      getTimestampValue(second.lastActivityAt) -
      getTimestampValue(first.lastActivityAt),
  );
}

export function filterCustomerConversations(
  conversations: CustomerConversation[],
  filters: {
    query: string;
    status: MessageStatus | 'all';
  },
) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return conversations.filter((conversation) => {
    const matchesQuery =
      !normalizedQuery ||
      [
        conversation.contactId,
        conversation.contactLabel,
        conversation.instancePublicId,
        conversation.lastPreview,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesStatus =
      filters.status === 'all' ||
      conversation.events.some(
        (event) =>
          event.direction === 'outbound' && event.status === filters.status,
      );

    return matchesQuery && matchesStatus;
  });
}

export function buildCustomerContacts(conversations: CustomerConversation[]) {
  const contacts = new Map<string, CustomerContact>();

  for (const conversation of conversations) {
    const existing = contacts.get(conversation.contactId);
    if (!existing) {
      contacts.set(conversation.contactId, {
        id: conversation.contactId,
        label: conversation.contactLabel,
        address: conversation.contactId,
        instancePublicIds: [conversation.instancePublicId],
        conversationIds: [conversation.id],
        lastActivityAt: conversation.lastActivityAt,
        lastPreview: conversation.lastPreview,
        inboundCount: conversation.inboundCount,
        outboundCount: conversation.outboundCount,
        failedCount: conversation.failedCount,
      });
      continue;
    }

    if (!existing.instancePublicIds.includes(conversation.instancePublicId)) {
      existing.instancePublicIds.push(conversation.instancePublicId);
    }
    if (!existing.conversationIds.includes(conversation.id)) {
      existing.conversationIds.push(conversation.id);
    }
    existing.inboundCount += conversation.inboundCount;
    existing.outboundCount += conversation.outboundCount;
    existing.failedCount += conversation.failedCount;
    if (
      getTimestampValue(conversation.lastActivityAt) >=
      getTimestampValue(existing.lastActivityAt)
    ) {
      existing.lastActivityAt = conversation.lastActivityAt;
      existing.lastPreview = conversation.lastPreview;
      existing.label = conversation.contactLabel;
    }
  }

  return [...contacts.values()].sort(
    (first, second) =>
      getTimestampValue(second.lastActivityAt) -
      getTimestampValue(first.lastActivityAt),
  );
}
