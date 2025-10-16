import { createClient } from '../client-typed'

// Temporary types for deployment
interface Asset {
  id: string
  company_id: string
  name: string
  purchase_date: string
  purchase_value: number
  useful_life_years: number
  depreciation_method: 'linear' | 'declining'
  current_value: number
  accumulated_depreciation: number
  status: 'active' | 'sold' | 'fully_depreciated' | 'disposed'
  notes: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

interface AssetInsert {
  id?: string
  company_id: string
  name: string
  purchase_date: string
  purchase_value: number
  useful_life_years: number
  depreciation_method?: 'linear' | 'declining'
  current_value: number
  accumulated_depreciation?: number
  status?: 'active' | 'sold' | 'fully_depreciated' | 'disposed'
  notes?: string | null
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

interface AssetUpdate {
  id?: string
  company_id?: string
  name?: string
  purchase_date?: string
  purchase_value?: number
  useful_life_years?: number
  depreciation_method?: 'linear' | 'declining'
  current_value?: number
  accumulated_depreciation?: number
  status?: 'active' | 'sold' | 'fully_depreciated' | 'disposed'
  notes?: string | null
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

const TEMP_COMPANY_ID = '123e4567-e89b-12d3-a456-426614174000'

export const assetsService = {
  // Obtener todos los activos
  async getAll(companyId: string = TEMP_COMPANY_ID): Promise<Asset[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('company_id', companyId)
      .order('purchase_date', { ascending: false })

    if (error) {
      console.error('Error al obtener activos:', error)
      throw error
    }

    return data || []
  },

  // Obtener activo por ID
  async getById(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al obtener activo:', error)
      throw error
    }

    return data
  },

  // Crear activo
  async create(asset: AssetInsert) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('assets')
      .insert({
        ...asset,
        company_id: TEMP_COMPANY_ID
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Error al crear activo:', error)
      throw error
    }

    return data
  },

  // Actualizar activo
  async update(id: string, asset: AssetUpdate) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('assets')
      .update({
        ...asset,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar activo:', error)
      throw error
    }

    return data
  },

  // Eliminar activo
  async delete(id: string) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar activo:', error)
      throw error
    }

    return true
  },

  // Calcular amortización anual
  calculateAnnualDepreciation(purchaseValue: number, usefulLifeYears: number): number {
    return purchaseValue / usefulLifeYears
  },

  // Calcular amortización acumulada
  calculateAccumulatedDepreciation(
    purchaseDate: string,
    purchaseValue: number,
    usefulLifeYears: number
  ): number {
    const purchase = new Date(purchaseDate)
    const now = new Date()
    const yearsDiff = (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 365)
    const annualDepreciation = this.calculateAnnualDepreciation(purchaseValue, usefulLifeYears)
    const accumulated = annualDepreciation * yearsDiff

    return Math.min(accumulated, purchaseValue)
  },

  // Calcular valor actual
  calculateCurrentValue(
    purchaseValue: number,
    accumulatedDepreciation: number
  ): number {
    return Math.max(0, purchaseValue - accumulatedDepreciation)
  }
}
