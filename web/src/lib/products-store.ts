"use client"

import { useSyncExternalStore } from "react"

import { initialProducts, type Product } from "@/lib/mock-data"

let products: Product[] = [...initialProducts]
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function getProductsSnapshot(): Product[] {
  return products
}

export function subscribeProducts(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function addProduct(product: Product) {
  products = [product, ...products.filter((item) => item.id !== product.id)]
  emit()
}

export function updateProduct(product: Product) {
  products = products.map((item) => (item.id === product.id ? product : item))
  emit()
}

export function removeProduct(id: string) {
  products = products.filter((item) => item.id !== id)
  emit()
}

export function getProductById(id: string): Product | undefined {
  return products.find((item) => item.id === id)
}

export function useProducts() {
  return useSyncExternalStore(
    subscribeProducts,
    getProductsSnapshot,
    getProductsSnapshot
  )
}
