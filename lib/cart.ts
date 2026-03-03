import type { StoreProduct } from "@/data/products";

export type CartItem = {
  handle: string;
  title: string;
  image: string;
  priceMad: number;
  quantity: number;
};

const CART_KEY = "proteinbar_cart_v1";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readCart(): CartItem[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.handle && item.quantity > 0);
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product: StoreProduct, quantity = 1) {
  const items = readCart();
  const index = items.findIndex((item) => item.handle === product.handle);
  if (index >= 0) {
    items[index].quantity += quantity;
  } else {
    items.push({
      handle: product.handle,
      title: product.title,
      image: product.image,
      priceMad: product.priceMad,
      quantity,
    });
  }
  writeCart(items);
  return items;
}

export function updateItemQuantity(handle: string, quantity: number) {
  const items = readCart();
  const next = items
    .map((item) => (item.handle === handle ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);
  writeCart(next);
  return next;
}

export function removeItem(handle: string) {
  const next = readCart().filter((item) => item.handle !== handle);
  writeCart(next);
  return next;
}

export function clearCart() {
  writeCart([]);
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.priceMad, 0);
}

