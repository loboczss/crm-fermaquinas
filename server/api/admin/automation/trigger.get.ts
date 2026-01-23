export default defineEventHandler(async (event) => {
  // In a real app, you'd protect this with a secret key
  const { secret } = getQuery(event)
  
  // Trigger the 'birthday' task manually
  const result = await runTask('birthday')
  
  return {
    success: true,
    message: 'Automation triggered',
    result
  }
})
