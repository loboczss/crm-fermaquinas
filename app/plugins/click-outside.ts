export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('click-outside', {
        mounted(el, binding) {
            el.clickOutsideEvent = (event: Event) => {
                // Check if the click was outside the element and its children
                if (!(el === event.target || el.contains(event.target as Node))) {
                    // Check if the handler is a function before calling it
                    if (typeof binding.value === 'function') {
                        binding.value(event)
                    }
                }
            }
            // Use capture true to ensure we catch events before they reach other handlers if needed
            // but usually bubble is fine for outside clicks.
            // Delay attachment to avoid firing on the same click that opened the element
            setTimeout(() => {
                document.addEventListener('click', el.clickOutsideEvent)
            }, 0)
        },
        unmounted(el) {
            if (el.clickOutsideEvent) {
                document.removeEventListener('click', el.clickOutsideEvent)
            }
        }
    })
})
