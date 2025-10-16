export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          tax_id: string
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          tax_id: string
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          tax_id?: string
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'accountant' | 'collaborator'
          company_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'accountant' | 'collaborator'
          company_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'accountant' | 'collaborator'
          company_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          company_id: string
          name: string
          tax_id: string | null
          email: string | null
          phone: string | null
          address: string | null
          type: 'client' | 'supplier' | 'both'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          tax_id?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          type?: 'client' | 'supplier' | 'both'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          tax_id?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          type?: 'client' | 'supplier' | 'both'
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          company_id: string
          type: 'issued' | 'received'
          invoice_number: string
          contact_id: string
          issue_date: string
          operation_date: string | null
          due_date: string | null
          concept: string
          base_amount: number
          vat_rate: number
          vat_amount: number
          total_amount: number
          payment_method: string | null
          payment_date: string | null
          status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          account_code: string | null
          notes: string | null
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          type: 'issued' | 'received'
          invoice_number: string
          contact_id: string
          issue_date: string
          operation_date?: string | null
          due_date?: string | null
          concept: string
          base_amount: number
          vat_rate: number
          vat_amount: number
          total_amount: number
          payment_method?: string | null
          payment_date?: string | null
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          account_code?: string | null
          notes?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          type?: 'issued' | 'received'
          invoice_number?: string
          contact_id?: string
          issue_date?: string
          operation_date?: string | null
          due_date?: string | null
          concept?: string
          base_amount?: number
          vat_rate?: number
          vat_amount?: number
          total_amount?: number
          payment_method?: string | null
          payment_date?: string | null
          status?: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
          account_code?: string | null
          notes?: string | null
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accounting_entries: {
        Row: {
          id: string
          company_id: string
          entry_number: string
          entry_date: string
          description: string
          invoice_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          entry_number: string
          entry_date: string
          description: string
          invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          entry_number?: string
          entry_date?: string
          description?: string
          invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accounting_lines: {
        Row: {
          id: string
          entry_id: string
          account_code: string
          account_name: string
          debit: number
          credit: number
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          account_code: string
          account_name: string
          debit?: number
          credit?: number
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          account_code?: string
          account_name?: string
          debit?: number
          credit?: number
          created_at?: string
        }
      }
      bank_movements: {
        Row: {
          id: string
          company_id: string
          movement_date: string
          description: string
          amount: number
          balance: number
          reconciled: boolean
          invoice_id: string | null
          expense_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          movement_date: string
          description: string
          amount: number
          balance: number
          reconciled?: boolean
          invoice_id?: string | null
          expense_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          movement_date?: string
          description?: string
          amount?: number
          balance?: number
          reconciled?: boolean
          invoice_id?: string | null
          expense_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          company_id: string
          supplier_id: string | null
          expense_date: string
          concept: string
          amount: number
          vat_rate: number
          vat_amount: number
          total_amount: number
          category: string
          account_code: string | null
          receipt_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          supplier_id?: string | null
          expense_date: string
          concept: string
          amount: number
          vat_rate: number
          vat_amount: number
          total_amount: number
          category: string
          account_code?: string | null
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          supplier_id?: string | null
          expense_date?: string
          concept?: string
          amount?: number
          vat_rate?: number
          vat_amount?: number
          total_amount?: number
          category?: string
          account_code?: string | null
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          company_id: string
          name: string
          purchase_date: string
          purchase_value: number
          useful_life_years: number
          depreciation_method: 'linear' | 'declining'
          current_value: number
          accumulated_depreciation: number
          status: 'active' | 'fully_depreciated' | 'sold' | 'disposed'
          image_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          purchase_date: string
          purchase_value: number
          useful_life_years: number
          depreciation_method?: 'linear' | 'declining'
          current_value: number
          accumulated_depreciation?: number
          status?: 'active' | 'fully_depreciated' | 'sold' | 'disposed'
          image_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          purchase_date?: string
          purchase_value?: number
          useful_life_years?: number
          depreciation_method?: 'linear' | 'declining'
          current_value?: number
          accumulated_depreciation?: number
          status?: 'active' | 'fully_depreciated' | 'sold' | 'disposed'
          image_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          company_id: string
          quote_number: string
          contact_id: string
          issue_date: string
          valid_until: string
          concept: string
          base_amount: number
          vat_rate: number
          vat_amount: number
          total_amount: number
          status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          notes: string | null
          converted_to_invoice: boolean
          invoice_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          quote_number: string
          contact_id: string
          issue_date: string
          valid_until: string
          concept: string
          base_amount: number
          vat_rate: number
          vat_amount: number
          total_amount: number
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          notes?: string | null
          converted_to_invoice?: boolean
          invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          quote_number?: string
          contact_id?: string
          issue_date?: string
          valid_until?: string
          concept?: string
          base_amount?: number
          vat_rate?: number
          vat_amount?: number
          total_amount?: number
          status?: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
          notes?: string | null
          converted_to_invoice?: boolean
          invoice_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
