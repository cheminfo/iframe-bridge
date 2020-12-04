export function postMessage<MessageType>(
  type: string,
  message: MessageType,
): void;
export function onMessage<MessageType>(
  callback: (message: MessageType) => void,
);
export function ready(): void;
