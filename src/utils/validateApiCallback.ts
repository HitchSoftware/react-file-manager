// REPO: @hitchsoftware/react-file-manager
// FILE: src/utils/validateApiCallback.ts

export const validateApiCallback = (
  callback: ((...args: any[]) => void) | undefined,
  callbackName: string,
  ...args: any[]
): void => {
  try {
    if (typeof callback === "function") {
      callback(...args);
    } else {
      throw new Error(
        `<FileManager /> Missing prop: Callback function "${callbackName}" is required.`
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error occurred in validateApiCallback.");
    }
  }
};
