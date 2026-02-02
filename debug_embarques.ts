
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NUXT_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NUXT_SUPABASE_KEY || process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function debug() {
    let log = '--- Database Inspection: historico_vendas_evastur ---\n'

    const { data: sample, error: schemaError } = await supabase
        .from('historico_vendas_evastur')
        .select('*')
        .limit(1)

    if (schemaError) {
        log += 'Error fetching sample: ' + JSON.stringify(schemaError) + '\n'
    } else if (sample && sample.length > 0) {
        log += '==== ALL COLUMNS LIST ====\n'
        Object.keys(sample[0]).sort().forEach(col => {
            log += ` COLUMN: ${col}\n`
        })

        log += '\n==== SAMPLE ROW VALUES ====\n'
        log += JSON.stringify(sample[0], null, 2) + '\n'
    }

    log += '\n--- Checking non-null Embarque values ---\n'
    const { data: embarques, error: eError } = await supabase
        .from('historico_vendas_evastur')
        .select('id, contact_name, embarque')
        .not('embarque', 'is', null)
        .not('embarque', 'eq', '')
        .limit(5)

    if (eError) {
        log += 'Error: ' + JSON.stringify(eError) + '\n'
    } else if (embarques && embarques.length > 0) {
        log += `Sample embarques found: ${embarques.length}\n`
        embarques.forEach(e => {
            log += ` ID: ${e.id} | NAME: ${e.contact_name} | EMBARQUE: ${e.embarque} (type: ${typeof e.embarque})\n`
        })
    }

    fs.writeFileSync('debug_results.txt', log)
    console.log('Results written to debug_results.txt')
}

debug()
