
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      startups: {
        Row: {
          id: string
          name: string
          industry: string | null
          stage: 'Idea' | 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Growth'
          website_url: string | null
          tagline: string | null
          logo_url: string | null
          description: string | null
          founded_year: number | null
          location: string | null
          team_size: string | null
          funding_ask: string | null
          contact_email: string | null
          socials: Json | null
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          stage?: 'Idea' | 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Growth'
          website_url?: string | null
          tagline?: string | null
          logo_url?: string | null
          description?: string | null
          founded_year?: number | null
          location?: string | null
          team_size?: string | null
          funding_ask?: string | null
          contact_email?: string | null
          socials?: Json | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          stage?: 'Idea' | 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Growth'
          website_url?: string | null
          tagline?: string | null
          logo_url?: string | null
          description?: string | null
          founded_year?: number | null
          location?: string | null
          team_size?: string | null
          funding_ask?: string | null
          contact_email?: string | null
          socials?: Json | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
            startup_id: string
            user_id: string
            role: 'owner' | 'admin' | 'editor' | 'viewer'
            department: string | null
            created_at: string
        }
        Insert: {
            startup_id: string
            user_id: string
            role: 'owner' | 'admin' | 'editor' | 'viewer'
            department?: string | null
            created_at?: string
        }
        Update: {
            startup_id?: string
            user_id?: string
            role?: 'owner' | 'admin' | 'editor' | 'viewer'
            department?: string | null
            created_at?: string
        }
      }
      financial_metrics: {
        Row: {
          id: string
          startup_id: string
          month: string
          revenue: number
          burn_rate: number
          cash_balance: number
          expenses: number
          active_users: number
          churn_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          month: string
          revenue?: number
          burn_rate?: number
          cash_balance?: number
          expenses?: number
          active_users?: number
          churn_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          month?: string
          revenue?: number
          burn_rate?: number
          cash_balance?: number
          expenses?: number
          active_users?: number
          churn_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          startup_id: string
          name: string
          storage_path: string
          category: 'Financial' | 'Legal' | 'Pitch Deck' | 'Product' | 'Market' | 'Other'
          size_bytes: number | null
          content_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          name: string
          storage_path: string
          category?: 'Financial' | 'Legal' | 'Pitch Deck' | 'Product' | 'Market' | 'Other'
          size_bytes?: number | null
          content_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          name?: string
          storage_path?: string
          category?: 'Financial' | 'Legal' | 'Pitch Deck' | 'Product' | 'Market' | 'Other'
          size_bytes?: number | null
          content_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      investor_docs: {
        Row: {
          id: string
          startup_id: string
          title: string
          type: 'one_pager' | 'update' | 'memo' | 'gtm_strategy'
          content: Json
          status: string | null
          preview_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          title: string
          type: 'one_pager' | 'update' | 'memo' | 'gtm_strategy'
          content?: Json
          status?: string | null
          preview_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          title?: string
          type?: 'one_pager' | 'update' | 'memo' | 'gtm_strategy'
          content?: Json
          status?: string | null
          preview_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      investor_contacts: {
        Row: {
          id: string
          startup_id: string
          firm_name: string
          contact_name: string | null
          type: 'VC' | 'Accelerator' | 'Angel Group' | 'CVC'
          status: 'Draft' | 'Submitted' | 'In Review' | 'Interview' | 'Due Diligence' | 'Accepted' | 'Rejected'
          check_size: string | null
          fit_score: number | null
          last_interaction_at: string
          next_step: string | null
          notes: string | null
          investor_id: string | null // Link to public directory if applicable
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          firm_name: string
          contact_name?: string | null
          type?: 'VC' | 'Accelerator' | 'Angel Group' | 'CVC'
          status?: 'Draft' | 'Submitted' | 'In Review' | 'Interview' | 'Due Diligence' | 'Accepted' | 'Rejected'
          check_size?: string | null
          fit_score?: number | null
          last_interaction_at?: string
          next_step?: string | null
          notes?: string | null
          investor_id?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          firm_name?: string
          contact_name?: string | null
          type?: 'VC' | 'Accelerator' | 'Angel Group' | 'CVC'
          status?: 'Draft' | 'Submitted' | 'In Review' | 'Interview' | 'Due Diligence' | 'Accepted' | 'Rejected'
          check_size?: string | null
          fit_score?: number | null
          last_interaction_at?: string
          next_step?: string | null
          notes?: string | null
          investor_id?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      investors: {
        Row: {
          id: string
          name: string
          type: 'vc' | 'accelerator' | 'angel_group' | 'corporate_vc'
          slug: string
          logo_url: string | null
          description: string | null
          website_url: string | null
          stages: string[]
          specialties: string[]
          geographies: string[]
          min_check_size: number | null
          max_check_size: number | null
          equity_percent_min: number | null
          equity_percent_max: number | null
          benefits: string[] | null
          time_to_decision: string | null
          notable_investments: string[] | null
          application_link: string | null
          contact_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'vc' | 'accelerator' | 'angel_group' | 'corporate_vc'
          slug: string
          logo_url?: string | null
          description?: string | null
          website_url?: string | null
          stages?: string[]
          specialties?: string[]
          geographies?: string[]
          min_check_size?: number | null
          max_check_size?: number | null
          equity_percent_min?: number | null
          equity_percent_max?: number | null
          benefits?: string[] | null
          time_to_decision?: string | null
          notable_investments?: string[] | null
          application_link?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'vc' | 'accelerator' | 'angel_group' | 'corporate_vc'
          slug?: string
          logo_url?: string | null
          description?: string | null
          website_url?: string | null
          stages?: string[]
          specialties?: string[]
          geographies?: string[]
          min_check_size?: number | null
          max_check_size?: number | null
          equity_percent_min?: number | null
          equity_percent_max?: number | null
          benefits?: string[] | null
          time_to_decision?: string | null
          notable_investments?: string[] | null
          application_link?: string | null
          contact_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
