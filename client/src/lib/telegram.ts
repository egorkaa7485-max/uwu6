import WebApp from "@twa-dev/sdk";

export function initTelegram() {
  if (typeof window !== "undefined") {
    WebApp.ready();
    WebApp.expand();
    
    WebApp.setHeaderColor("#1a1a1a");
    WebApp.setBackgroundColor("#1a1a1a");
  }
}

export function getTelegramInitData(): string {
  if (typeof window !== "undefined" && WebApp.initData) {
    return WebApp.initData;
  }
  return "";
}

export function getTelegramUser() {
  if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
    return WebApp.initDataUnsafe.user;
  }
  return null;
}

export function showBackButton(onClick: () => void) {
  WebApp.BackButton.show();
  WebApp.BackButton.onClick(onClick);
}

export function hideBackButton() {
  WebApp.BackButton.hide();
}

export function showMainButton(text: string, onClick: () => void) {
  WebApp.MainButton.setText(text);
  WebApp.MainButton.show();
  WebApp.MainButton.onClick(onClick);
}

export function hideMainButton() {
  WebApp.MainButton.hide();
}

export function hapticFeedback(type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "medium") {
  if (WebApp.HapticFeedback) {
    if (type === "success" || type === "warning" || type === "error") {
      WebApp.HapticFeedback.notificationOccurred(type);
    } else {
      WebApp.HapticFeedback.impactOccurred(type as "light" | "medium" | "heavy");
    }
  }
}

export const telegram = WebApp;
