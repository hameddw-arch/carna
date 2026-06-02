import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hofuxamyrdbtqzethagl.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

const governorates = [
  'دمشق',           // Damascus
  'ريف دمشق',       // Rural Damascus
  'حلب',            // Aleppo
  'اللاذقية',       // Latakia
  'طرطوس',          // Tartus
  'حمص',            // Homs
  'حماة',           // Hama
  'إدلب',           // Idlib
  'دير الزور',      // Deir ez-Zor
  'الرقة',          // Raqqa
  'الحسكة',         // Al-Hasaka
  'درعا',           // Daraa
  'السويداء',       // Suwayda
  'القنيطرة'        // Quneitra
]

async function seedGovernorates() {
  console.log('🌍 بدء إضافة المحافظات السورية...')

  try {
    // Check if governorates table exists
    const { data: existingData, error: selectError } = await supabase
      .from('governorates')
      .select('name')
      .limit(1)

    if (selectError && !selectError.message.includes('not found')) {
      throw selectError
    }

    // Add governorates
    const { data, error } = await supabase
      .from('governorates')
      .insert(
        governorates.map((name) => ({
          name,
          is_active: true,
          created_at: new Date().toISOString()
        }))
      )
      .select()

    if (error) {
      console.error('❌ خطأ في إضافة البيانات:', error)
      throw error
    }

    console.log(`✅ تمت إضافة ${data.length} محافظات بنجاح`)
    console.log('\nالمحافظات المضافة:')
    data.forEach((gov: any) => {
      console.log(`  ✓ ${gov.name}`)
    })
  } catch (error) {
    console.error('❌ فشل بذر البيانات:', error)
    process.exit(1)
  }
}

seedGovernorates()
