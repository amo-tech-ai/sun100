
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
      crm_accounts: {
        Row: {
          id: string
          startup_id: string
          name: string
          logo_url: string | null
          segment: 'Enterprise' | 'SMB' | 'Mid-Market' | 'Partner' | null
          status: 'Active' | 'Churned' | 'Trial' | 'Lead' | null
          mrr: number
          health_score: number
          last_interaction_at: string | null
          renewal_date: string | null
          owner_id: string | null
          created_at: string
          updated_at: string
          extended_info: Json | null
          last_enriched_at: string | null
        }
        Insert: {
          id?: string
          startup_id: string
          name: string
          logo_url?: string | null
          segment?: 'Enterprise' | 'SMB' | 'Mid-Market' | 'Partner' | null
          status?: 'Active' | 'Churned' | 'Trial' | 'Lead' | null
          mrr?: number
          health_score?: number
          last_interaction_at?: string | null
          renewal_date?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
          extended_info?: Json | null
          last_enriched_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string
          name?: string
          logo_url?: string | null
          segment?: 'Enterprise' | 'SMB' | 'Mid-Market' | 'Partner' | null
          status?: 'Active' | 'Churned' | 'Trial' | 'Lead' | null
          mrr?: number
          health_score?: number
          last_interaction_at?: string | null
          renewal_date?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
          extended_info?: Json | null
          last_enriched_at?: string | null
        }
      }
      crm_contacts: {
        Row: {
          id: string
          startup_id: string
          account_id: string | null
          first_name: string
          last_name: string | null
          email: string | null
          role: string | null
          linkedin_url: string | null
          title: string | null
          status: string | null
          owner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          account_id?: string | null
          first_name: string
          last_name?: string | null
          email?: string | null
          role?: string | null
          linkedin_url?: string | null
          title?: string | null
          status?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          account_id?: string | null
          first_name?: string
          last_name?: string | null
          email?: string | null
          role?: string | null
          linkedin_url?: string | null
          title?: string | null
          status?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      crm_deals: {
        Row: {
          id: string
          startup_id: string
          account_id: string | null
          name: string
          value: number
          stage: string | null
          probability: number
          expected_close_date: string | null
          ai_score: number | null
          ai_reasoning: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          account_id?: string | null
          name: string
          value?: number
          stage?: string | null
          probability?: number
          expected_close_date?: string | null
          ai_score?: number | null
          ai_reasoning?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          account_id?: string | null
          name?: string
          value?: number
          stage?: string | null
          probability?: number
          expected_close_date?: string | null
          ai_score?: number | null
          ai_reasoning?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      crm_interactions: {
        Row: {
          id: string
          startup_id: string
          account_id: string | null
          user_id: string | null
          type: string | null
          summary: string
          date: string
          sentiment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          account_id?: string | null
          user_id?: string | null
          type?: string | null
          summary: string
          date?: string
          sentiment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          account_id?: string | null
          user_id?: string | null
          type?: string | null
          summary?: string
          date?: string
          sentiment?: string | null
          created_at?: string
        }
      }
      crm_tasks: {
        Row: {
          id: string
          startup_id: string
          account_id: string | null
          assigned_to: string | null
          title: string
          description: string | null
          due_date: string | null
          completed: boolean
          priority: 'low' | 'medium' | 'high' | 'urgent'
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          account_id?: string | null
          assigned_to?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          account_id?: string | null
          assigned_to?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          startup_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          startup_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          startup_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      crm_lead_enrichment: {
        Row: {
          id: string
          lead_id: string
          company_id: string | null
          ceo_name: string | null
          ceo_linkedin: string | null
          linkedin_company_url: string | null
          recent_news: Json | null
          funding_history: Json | null
          hiring_trends: Json | null
          market_presence_score: number | null
          search_trend_score: number | null
          gemini_summary: string | null
          evidence_links: Json | null
          raw_model_response: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          company_id?: string | null
          ceo_name?: string | null
          ceo_linkedin?: string | null
          linkedin_company_url?: string | null
          recent_news?: Json | null
          funding_history?: Json | null
          hiring_trends?: Json | null
          market_presence_score?: number | null
          search_trend_score?: number | null
          gemini_summary?: string | null
          evidence_links?: Json | null
          raw_model_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          company_id?: string | null
          ceo_name?: string | null
          ceo_linkedin?: string | null
          linkedin_company_url?: string | null
          recent_news?: Json | null
          funding_history?: Json | null
          hiring_trends?: Json | null
          market_presence_score?: number | null
          search_trend_score?: number | null
          gemini_summary?: string | null
          evidence_links?: Json | null
          raw_model_response?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      crm_lead_scores: {
        Row: {
          id: string
          lead_id: string
          overall_score: number
          confidence: number | null
          status_band: string | null
          stage_recommendation: string | null
          industry_fit: number | null
          company_size_fit: number | null
          budget_fit: number | null
          problem_fit: number | null
          engagement_fit: number | null
          search_trend_score: number | null
          risk_score: number | null
          ai_findings: Json | null
          risks: Json | null
          recommended_next_actions: Json | null
          model_version: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          overall_score: number
          confidence?: number | null
          status_band?: string | null
          stage_recommendation?: string | null
          industry_fit?: number | null
          company_size_fit?: number | null
          budget_fit?: number | null
          problem_fit?: number | null
          engagement_fit?: number | null
          search_trend_score?: number | null
          risk_score?: number | null
          ai_findings?: Json | null
          risks?: Json | null
          recommended_next_actions?: Json | null
          model_version?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          overall_score?: number
          confidence?: number | null
          status_band?: string | null
          stage_recommendation?: string | null
          industry_fit?: number | null
          company_size_fit?: number | null
          budget_fit?: number | null
          problem_fit?: number | null
          engagement_fit?: number | null
          search_trend_score?: number | null
          risk_score?: number | null
          ai_findings?: Json | null
          risks?: Json | null
          recommended_next_actions?: Json | null
          model_version?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
