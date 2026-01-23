<template>
  <PageShell>
    <section class="py-16">
      <div class="text-center">
        <h2 class="text-4xl font-semibold text-gray-900 mb-4">
          Bem-vindo ao <span class="text-primary">CRM Eva</span>
        </h2>
        <p class="text-lg text-gray-500 mb-8">
          Gerencie seus clientes de forma inteligente e eficiente
        </p>

        <div class="flex gap-4 justify-center">
          <button @click="handleLogin" class="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200">
            Começar Agora
          </button>
          <button @click="handleRegister" class="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200">
            Saiba Mais
          </button>
        </div>
      </div>
    </section>

    <section class="py-8">
      <h3 class="text-2xl font-semibold text-center text-gray-900 mb-8">Recursos Principais</h3>

      <div class="grid md:grid-cols-3 gap-6">
        <SurfaceCard class="border-l-4 border-primary">
          <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Gestão de Clientes</h4>
          <p class="text-gray-500">Organize e acompanhe todos os seus clientes em um só lugar</p>
        </SurfaceCard>

        <SurfaceCard class="border-l-4 border-gray-900">
          <div class="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Análises e Relatórios</h4>
          <p class="text-gray-500">Visualize métricas e insights importantes do seu negócio</p>
        </SurfaceCard>

        <SurfaceCard class="border-l-4 border-primary">
          <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Automação</h4>
          <p class="text-gray-500">Automatize tarefas repetitivas e aumente sua produtividade</p>
        </SurfaceCard>
      </div>
    </section>
  </PageShell>
</template>

<script setup lang="ts">
import PageShell from '~/components/PageShell.vue'
import SurfaceCard from '~/components/SurfaceCard.vue'
</script>

<script setup lang="ts">
import { navigateTo } from '#imports'

const handleLogin = async () => {
  await navigateTo('/login')
}

const handleRegister = async () => {
  await navigateTo('/cadastro')
}
</script>
