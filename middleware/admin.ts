import { defineNuxtRouteMiddleware, useState, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
  // Public: let them hit login directly
  if (to.path === '/admin/login') return

  // Otherwise, require adminAuth
  const isAdmin = useState('adminAuth').value
  if (!isAdmin) return navigateTo('/admin/login')
})