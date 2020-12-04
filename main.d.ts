export function postAll<MessageType>(type: string, message: MessageType): void;
export function postMessage<MessageType>(
  type: string,
  message: MessageType,
  windowId: number,
): void;
export function registerHandler<MessageType>(
  type: string,
  callback: (message: MessageType) => void,
);
