// Hand-written to match supabase/migrations/0001_init.sql.
// Once the project is linked, this can be regenerated with:
//   npx supabase gen types typescript --linked > src/lib/supabase/database.types.ts

export type UserRole = "head_admin" | "parent" | "player";
export type UserStatus = "pending" | "active";
export type TestimonialStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          date_of_birth: string | null;
          team_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
        Relationships: [];
      };
      guardians_players: {
        Row: {
          guardian_id: string;
          player_id: string;
          created_at: string;
        };
        Insert: {
          guardian_id: string;
          player_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guardians_players"]["Row"]>;
        Relationships: [];
      };
      load_entries: {
        Row: {
          id: string;
          player_id: string;
          activity_date: string;
          description: string;
          duration_minutes: number;
          rpe: number;
          session_load: number;
          notes: string | null;
          logged_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          activity_date: string;
          description: string;
          duration_minutes: number;
          rpe: number;
          notes?: string | null;
          logged_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["load_entries"]["Insert"]>;
        Relationships: [];
      };
      sleep_entries: {
        Row: {
          id: string;
          player_id: string;
          entry_date: string;
          duration_hours: number;
          quality: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          entry_date: string;
          duration_hours: number;
          quality: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sleep_entries"]["Insert"]>;
        Relationships: [];
      };
      academy_settings: {
        Row: {
          id: boolean;
          hard_rpe_threshold: number;
          max_hard_sessions_week: number;
          guided_mode_age_cutoff: number;
          sleep_target_min_hours: number;
          sleep_target_max_hours: number;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["academy_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["academy_settings"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_id: string;
          author_name: string;
          designation: string;
          quote: string;
          status: TestimonialStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          author_name: string;
          designation: string;
          quote: string;
          status?: TestimonialStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      testimonial_status: TestimonialStatus;
    };
  };
}
