import { defineStore } from 'pinia';
import type { Product } from '@/api/modules/products';

export interface CartLine {
  product: Product;
  quantity: number;
  selected: boolean;
}

interface CartState {
  lines: CartLine[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({ lines: [] }),
  getters: {
    itemCount: (state) =>
      state.lines.reduce((total, line) => total + line.quantity, 0),
    selectedCount: (state) =>
      state.lines
        .filter((line) => line.selected)
        .reduce((total, line) => total + line.quantity, 0),
    selectedTotal: (state) =>
      state.lines
        .filter((line) => line.selected)
        .reduce(
          (total, line) => total + line.product.priceCents * line.quantity,
          0,
        ),
    allSelected: (state) =>
      state.lines.length > 0 && state.lines.every((line) => line.selected),
  },
  actions: {
    add(product: Product, quantity = 1) {
      const current = this.lines.find((line) => line.product.id === product.id);
      if (current) {
        current.product = product;
        current.quantity = Math.min(
          product.stock,
          current.quantity + Math.max(1, quantity),
        );
        current.selected = true;
        return;
      }
      this.lines.push({
        product,
        quantity: Math.min(product.stock, Math.max(1, quantity)),
        selected: true,
      });
    },
    setQuantity(productId: number, quantity: number) {
      const line = this.lines.find((item) => item.product.id === productId);
      if (!line) return;
      line.quantity = Math.min(
        line.product.stock,
        Math.max(1, Math.trunc(quantity)),
      );
    },
    toggle(productId: number) {
      const line = this.lines.find((item) => item.product.id === productId);
      if (line) line.selected = !line.selected;
    },
    toggleAll() {
      const selected = !this.allSelected;
      this.lines.forEach((line) => {
        line.selected = selected;
      });
    },
    remove(productId: number) {
      this.lines = this.lines.filter((line) => line.product.id !== productId);
    },
    clearSelected() {
      this.lines = this.lines.filter((line) => !line.selected);
    },
  },
  persist: {
    storage: localStorage,
  },
});
