import { createClient } from '@/lib/supabase/client'

export async function getUserPlan(): Promise<'free' | 'premium'> {
  try {
    const supabase = createClient()

    // getSession reads locally — works without network round-trip
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return 'free'

    const { data } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', session.user.id)
      .single()

    return (data?.plan === 'premium') ? 'premium' : 'free'
  } catch {
    return 'free'
  }
}
