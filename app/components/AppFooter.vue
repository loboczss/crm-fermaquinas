<template>
  <footer class="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="col-span-1 md:col-span-1">
          <NuxtLink to="/" class="text-xl font-bold text-white tracking-tight flex items-center gap-1 mb-6">
            CRM Eva<span class="text-primary text-2xl">.</span>
          </NuxtLink>
          <p class="text-sm leading-relaxed">
            Solução inteligente para gestão de clientes. Potencialize seu negócio com organização e eficiência.
          </p>
        </div>
        
        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] font-bold text-white mb-6">Plataforma</h4>
          <ul class="space-y-4 text-sm">
            <li>
              <NuxtLink to="/" class="hover:text-white transition-colors">Dashboard</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/clientes" class="hover:text-white transition-colors">Gestão de Clientes</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/relatorios" class="hover:text-white transition-colors">Análise de Dados</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] font-bold text-white mb-6">Suporte</h4>
          <ul class="space-y-4 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">Central de Ajuda</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Documentação API</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Status do Sistema</a></li>
            <li>
              <NuxtLink to="/privacidade" class="hover:text-white transition-colors">Política de Privacidade</NuxtLink>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-xs uppercase tracking-[0.2em] font-bold text-white mb-6">Contato</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-center gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
              contato@crmeva.com
            </li>
            <li class="flex items-center gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
              (11) 9999-9999
            </li>
            <li class="flex items-center gap-3">
              <span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
              São Paulo, SP
            </li>
          </ul>
        </div>
      </div>
      
      <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-xs uppercase tracking-widest">&copy; 2026 CRM Eva. All rights reserved.</p>
        <div class="flex gap-6 text-xs uppercase tracking-widest">
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer do aplicativo
</script>
