export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          assignee_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          done: boolean | null
          due_at: string | null
          id: string
          related_id: string | null
          related_type: string | null
          subject: string
          tenant_id: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          done?: boolean | null
          due_at?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          subject: string
          tenant_id: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          done?: boolean | null
          due_at?: string | null
          id?: string
          related_id?: string | null
          related_type?: string | null
          subject?: string
          tenant_id?: string
          type?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          data: Json | null
          entity: string
          entity_id: string | null
          id: string
          ip_address: unknown | null
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          data?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown | null
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          data?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown | null
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          actions: Json
          active: boolean | null
          conditions: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string
          trigger: Json
          updated_at: string | null
        }
        Insert: {
          actions: Json
          active?: boolean | null
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          trigger: Json
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          active?: boolean | null
          conditions?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          trigger?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          audience_filter: Json | null
          channel: Database["public"]["Enums"]["channel_type"]
          created_at: string | null
          id: string
          name: string
          scheduled_at: string | null
          sent_count: number | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          template_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          audience_filter?: Json | null
          channel: Database["public"]["Enums"]["channel_type"]
          created_at?: string | null
          id?: string
          name: string
          scheduled_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          template_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          audience_filter?: Json | null
          channel?: Database["public"]["Enums"]["channel_type"]
          created_at?: string | null
          id?: string
          name?: string
          scheduled_at?: string | null
          sent_count?: number | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          template_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          connected_at: string | null
          created_at: string | null
          id: string
          name: string
          provider: string | null
          settings: Json | null
          status: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["channel_type"]
          updated_at: string | null
        }
        Insert: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          name: string
          provider?: string | null
          settings?: Json | null
          status?: string | null
          tenant_id: string
          type: Database["public"]["Enums"]["channel_type"]
          updated_at?: string | null
        }
        Update: {
          connected_at?: string | null
          created_at?: string | null
          id?: string
          name?: string
          provider?: string | null
          settings?: Json | null
          status?: string | null
          tenant_id?: string
          type?: Database["public"]["Enums"]["channel_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          id: string
          name: string
          phone: string | null
          tenant_id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company_id: string | null
          created_at: string | null
          custom_fields: Json | null
          email: string | null
          id: string
          owner_id: string | null
          person_name: string
          phone: string | null
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          owner_id?: string | null
          person_name: string
          phone?: string | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string | null
          id?: string
          owner_id?: string | null
          person_name?: string
          phone?: string | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_to: string | null
          channel_id: string | null
          contact_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          subject: string | null
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          channel_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          channel_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          subject?: string | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          amount: number | null
          company_id: string | null
          contact_id: string | null
          created_at: string | null
          currency: string | null
          custom_fields: Json | null
          expected_close: string | null
          id: string
          owner_id: string | null
          pipeline_id: string
          probability: number | null
          stage_id: string
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          custom_fields?: Json | null
          expected_close?: string | null
          id?: string
          owner_id?: string | null
          pipeline_id: string
          probability?: number | null
          stage_id: string
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          custom_fields?: Json | null
          expected_close?: string | null
          id?: string
          owner_id?: string | null
          pipeline_id?: string
          probability?: number | null
          stage_id?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string | null
          filename: string
          id: string
          mime_type: string | null
          owner_id: string | null
          size_bytes: number | null
          tenant_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          filename: string
          id?: string
          mime_type?: string | null
          owner_id?: string | null
          size_bytes?: number | null
          tenant_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          filename?: string
          id?: string
          mime_type?: string | null
          owner_id?: string | null
          size_bytes?: number | null
          tenant_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          contact_id: string | null
          created_at: string | null
          currency: string | null
          deal_id: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          pdf_url: string | null
          quote_id: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          stripe_invoice_id: string | null
          tenant_id: string
          total: number | null
          updated_at: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          deal_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          pdf_url?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          stripe_invoice_id?: string | null
          tenant_id: string
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          deal_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          pdf_url?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          stripe_invoice_id?: string | null
          tenant_id?: string
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string | null
          id: string
          invited_at: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["role_type"]
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role: Database["public"]["Enums"]["role_type"]
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["role_type"]
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          body: string | null
          conversation_id: string
          created_at: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          id: string
          metadata: Json | null
          sent_at: string | null
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          conversation_id: string
          created_at?: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          id?: string
          metadata?: Json | null
          sent_at?: string | null
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          conversation_id?: string
          created_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"]
          id?: string
          metadata?: Json | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          created_at: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          is_default: boolean | null
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_default?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_default?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipelines_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          name: string
          price: number
          sku: string | null
          tax_rate: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          name: string
          price?: number
          sku?: string | null
          tax_rate?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          sku?: string | null
          tax_rate?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          language: string | null
          name: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          language?: string | null
          name?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          language?: string | null
          name?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          price: number
          product_id: string | null
          quantity: number
          quote_id: string
          tax_rate: number | null
          total: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          price: number
          product_id?: string | null
          quantity?: number
          quote_id: string
          tax_rate?: number | null
          total: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          quote_id?: string
          tax_rate?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          contact_id: string | null
          created_at: string | null
          currency: string | null
          deal_id: string | null
          id: string
          notes: string | null
          pdf_url: string | null
          quote_number: string | null
          status: Database["public"]["Enums"]["quote_status"] | null
          tenant_id: string
          total: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          deal_id?: string | null
          id?: string
          notes?: string | null
          pdf_url?: string | null
          quote_number?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tenant_id: string
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          currency?: string | null
          deal_id?: string | null
          id?: string
          notes?: string | null
          pdf_url?: string | null
          quote_number?: string | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          tenant_id?: string
          total?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          tenant_id: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          tenant_id: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          tenant_id?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      stages: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          order_index: number
          pipeline_id: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          order_index: number
          pipeline_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
          pipeline_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          body: string
          channel: Database["public"]["Enums"]["channel_type"]
          created_at: string | null
          id: string
          name: string
          subject: string | null
          tenant_id: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          body: string
          channel: Database["public"]["Enums"]["channel_type"]
          created_at?: string | null
          id?: string
          name: string
          subject?: string | null
          tenant_id: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          body?: string
          channel?: Database["public"]["Enums"]["channel_type"]
          created_at?: string | null
          id?: string
          name?: string
          subject?: string | null
          tenant_id?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: Database["public"]["Enums"]["tenant_plan"] | null
          settings: Json | null
          status: Database["public"]["Enums"]["tenant_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: Database["public"]["Enums"]["tenant_plan"] | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: Database["public"]["Enums"]["tenant_plan"] | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["tenant_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_subscriptions: {
        Row: {
          active: boolean | null
          created_at: string | null
          events: string[]
          id: string
          secret: string
          target_url: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          events: string[]
          id?: string
          secret: string
          target_url: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          events?: string[]
          id?: string
          secret?: string
          target_url?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      activity_type:
        | "call"
        | "meet"
        | "task"
        | "note"
        | "email"
        | "whatsapp"
        | "telegram"
        | "instagram"
      campaign_status: "draft" | "scheduled" | "sending" | "sent" | "paused"
      channel_type: "whatsapp" | "instagram" | "telegram" | "email"
      conversation_status: "open" | "pending" | "closed"
      entity_type: "deal" | "ticket"
      invoice_status: "draft" | "issued" | "paid" | "overdue"
      message_direction: "in" | "out"
      quote_status: "draft" | "sent" | "accepted" | "rejected"
      role_type: "owner" | "admin" | "manager" | "agent" | "viewer"
      tenant_plan: "starter" | "pro" | "business" | "enterprise"
      tenant_status: "active" | "suspended" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "call",
        "meet",
        "task",
        "note",
        "email",
        "whatsapp",
        "telegram",
        "instagram",
      ],
      campaign_status: ["draft", "scheduled", "sending", "sent", "paused"],
      channel_type: ["whatsapp", "instagram", "telegram", "email"],
      conversation_status: ["open", "pending", "closed"],
      entity_type: ["deal", "ticket"],
      invoice_status: ["draft", "issued", "paid", "overdue"],
      message_direction: ["in", "out"],
      quote_status: ["draft", "sent", "accepted", "rejected"],
      role_type: ["owner", "admin", "manager", "agent", "viewer"],
      tenant_plan: ["starter", "pro", "business", "enterprise"],
      tenant_status: ["active", "suspended", "cancelled"],
    },
  },
} as const
