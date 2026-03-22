// ─────────────────────────────────────────────────────────────────────────────
// Database type definitions — mirrors supabase/migrations/20260322000001_initial_schema.sql
//
// Tip: replace this file with:
//   npx supabase gen types typescript --project-id <your-project-ref> > src/lib/supabase/types.ts
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "customer" | "service_provider";
export type RequestStatus = "open" | "closed";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: UserRole;
          location: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          phone?: string | null;
          role?: UserRole;
          location?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: UserRole;
          location?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_categories: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          icon?: string | null;
        };
        Relationships: [];
      };
      provider_skills: {
        Row: {
          id: number;
          provider_id: string;
          category_id: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          provider_id: string;
          category_id: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          provider_id?: string;
          category_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "provider_skills_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "provider_skills_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      service_requests: {
        Row: {
          id: number;
          customer_id: string;
          category_id: number | null;
          title: string;
          description: string;
          location: string;
          status: RequestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          customer_id: string;
          category_id?: number | null;
          title?: string;
          description: string;
          location: string;
          status?: RequestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: string;
          category_id?: number | null;
          title?: string;
          description?: string;
          location?: string;
          status?: RequestStatus;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_requests_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_requests_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      request_status: RequestStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ─── Convenience row types extracted from the Database shape ─────────────────
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ServiceCategory = Database["public"]["Tables"]["service_categories"]["Row"];
export type ProviderSkill = Database["public"]["Tables"]["provider_skills"]["Row"];
export type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];

// ─── Joined / enriched shapes (for UI queries) ───────────────────────────────
export interface ServiceRequestWithCategory extends ServiceRequest {
  service_categories: Pick<ServiceCategory, "id" | "name" | "icon"> | null;
}

export interface ProviderSkillWithCategory extends ProviderSkill {
  service_categories: Pick<ServiceCategory, "id" | "name" | "icon">;
}
