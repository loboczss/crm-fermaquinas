
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NUXT_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NUXT_SUPABASE_KEY || process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function debug() {
    const { count, error } = await supabase
        .from('historico_vendas_evastur')
        .select('*', { count: 'exact', head: true })
        .not('embarque', 'is', null)

    let log = `Total rows with non-null embarque: ${count}\n`
    if (error) log += 'Error: ' + JSON.stringify(error) + '\n'

    fs.writeFileSync('count_results.txt', log)
}

debug()
