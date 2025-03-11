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
      forms: {
        Row: {
          id: string
          title: string
          description: string | null
          fields: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          fields?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          fields?: Json
          created_at?: string
          updated_at?: string
        }
      }
      form_responses: {
        Row: {
          id: string
          form_id: string
          responses: Json
          created_at: string
        }
        Insert: {
          id?: string
          form_id: string
          responses: Json
          created_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          responses?: Json
          created_at?: string
        }
      }
    }
  }
}