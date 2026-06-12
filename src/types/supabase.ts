export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      alerts: {
        Row: {
          channel: Database["public"]["Enums"]["alert_channel"];
          clicked_at: string | null;
          created_at: string;
          delivered_at: string | null;
          external_message_id: string | null;
          failed_at: string | null;
          failure_reason: string | null;
          id: string;
          message_text: string;
          related_amount: number | null;
          scheduled_for: string;
          sent_at: string | null;
          status: Database["public"]["Enums"]["alert_status"];
          subscription_id: string | null;
          type: Database["public"]["Enums"]["alert_type"];
          user_id: string;
        };
        Insert: {
          channel: Database["public"]["Enums"]["alert_channel"];
          clicked_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
          external_message_id?: string | null;
          failed_at?: string | null;
          failure_reason?: string | null;
          id?: string;
          message_text: string;
          related_amount?: number | null;
          scheduled_for: string;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["alert_status"];
          subscription_id?: string | null;
          type: Database["public"]["Enums"]["alert_type"];
          user_id: string;
        };
        Update: {
          channel?: Database["public"]["Enums"]["alert_channel"];
          clicked_at?: string | null;
          created_at?: string;
          delivered_at?: string | null;
          external_message_id?: string | null;
          failed_at?: string | null;
          failure_reason?: string | null;
          id?: string;
          message_text?: string;
          related_amount?: number | null;
          scheduled_for?: string;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["alert_status"];
          subscription_id?: string | null;
          type?: Database["public"]["Enums"]["alert_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alerts_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alerts_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "v_upcoming_renewals";
            referencedColumns: ["subscription_id"];
          },
          {
            foreignKeyName: "alerts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cancel_events: {
        Row: {
          annual_savings_inr: number;
          confirmed_at: string;
          confirmed_by: string;
          id: string;
          is_reverted: boolean;
          monthly_amount_inr: number;
          reverted_at: string | null;
          subscription_id: string;
          user_id: string;
        };
        Insert: {
          annual_savings_inr: number;
          confirmed_at?: string;
          confirmed_by: string;
          id?: string;
          is_reverted?: boolean;
          monthly_amount_inr: number;
          reverted_at?: string | null;
          subscription_id: string;
          user_id: string;
        };
        Update: {
          annual_savings_inr?: number;
          confirmed_at?: string;
          confirmed_by?: string;
          id?: string;
          is_reverted?: boolean;
          monthly_amount_inr?: number;
          reverted_at?: string | null;
          subscription_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cancel_events_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cancel_events_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "v_upcoming_renewals";
            referencedColumns: ["subscription_id"];
          },
          {
            foreignKeyName: "cancel_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cancel_guides: {
        Row: {
          created_at: string;
          estimated_minutes: number;
          has_retention_offers: boolean | null;
          id: string;
          is_published: boolean;
          language: Database["public"]["Enums"]["user_language"];
          markdown_content: string;
          retention_warning_text: string | null;
          service_id: string;
          step_count: number;
          title: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          estimated_minutes?: number;
          has_retention_offers?: boolean | null;
          id?: string;
          is_published?: boolean;
          language?: Database["public"]["Enums"]["user_language"];
          markdown_content: string;
          retention_warning_text?: string | null;
          service_id: string;
          step_count: number;
          title: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          estimated_minutes?: number;
          has_retention_offers?: boolean | null;
          id?: string;
          is_published?: boolean;
          language?: Database["public"]["Enums"]["user_language"];
          markdown_content?: string;
          retention_warning_text?: string | null;
          service_id?: string;
          step_count?: number;
          title?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cancel_guides_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      email_scans: {
        Row: {
          completed_at: string | null;
          emails_processed: number;
          emails_total: number;
          error_count: number;
          error_message: string | null;
          id: string;
          queued_at: string;
          retry_count: number;
          scan_from_date: string;
          scan_to_date: string;
          started_at: string | null;
          status: Database["public"]["Enums"]["scan_status"];
          subscriptions_found: number;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          emails_processed?: number;
          emails_total?: number;
          error_count?: number;
          error_message?: string | null;
          id?: string;
          queued_at?: string;
          retry_count?: number;
          scan_from_date: string;
          scan_to_date: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["scan_status"];
          subscriptions_found?: number;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          emails_processed?: number;
          emails_total?: number;
          error_count?: number;
          error_message?: string | null;
          id?: string;
          queued_at?: string;
          retry_count?: number;
          scan_from_date?: string;
          scan_to_date?: string;
          started_at?: string | null;
          status?: Database["public"]["Enums"]["scan_status"];
          subscriptions_found?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "email_scans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      gmail_tokens: {
        Row: {
          access_token_encrypted: string;
          access_token_expires_at: string;
          gmail_email: string;
          granted_at: string;
          last_used_at: string;
          refresh_token_encrypted: string;
          revoked_at: string | null;
          scopes: string[];
          user_id: string;
        };
        Insert: {
          access_token_encrypted: string;
          access_token_expires_at: string;
          gmail_email: string;
          granted_at?: string;
          last_used_at?: string;
          refresh_token_encrypted: string;
          revoked_at?: string | null;
          scopes: string[];
          user_id: string;
        };
        Update: {
          access_token_encrypted?: string;
          access_token_expires_at?: string;
          gmail_email?: string;
          granted_at?: string;
          last_used_at?: string;
          refresh_token_encrypted?: string;
          revoked_at?: string | null;
          scopes?: string[];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gmail_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          alert_channel_preference: string;
          alert_lead_days: number;
          auth_provider: string;
          avatar_url: string | null;
          created_at: string;
          deleted_at: string | null;
          email: string;
          first_scan_completed_at: string | null;
          google_id: string | null;
          id: string;
          language: Database["public"]["Enums"]["user_language"];
          last_active_at: string;
          name: string | null;
          onboarding_completed_at: string | null;
          phone: string | null;
          phone_verified: boolean;
          quiet_hours_end: string;
          quiet_hours_start: string;
          razorpay_customer_id: string | null;
          telegram_chat_id: number | null;
          telegram_linked_at: string | null;
          telegram_username: string | null;
          tier: Database["public"]["Enums"]["user_tier"];
          tier_expires_at: string | null;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          alert_channel_preference?: string;
          alert_lead_days?: number;
          auth_provider?: string;
          avatar_url?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          email: string;
          first_scan_completed_at?: string | null;
          google_id?: string | null;
          id: string;
          language?: Database["public"]["Enums"]["user_language"];
          last_active_at?: string;
          name?: string | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          phone_verified?: boolean;
          quiet_hours_end?: string;
          quiet_hours_start?: string;
          razorpay_customer_id?: string | null;
          telegram_chat_id?: number | null;
          telegram_linked_at?: string | null;
          telegram_username?: string | null;
          tier?: Database["public"]["Enums"]["user_tier"];
          tier_expires_at?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          alert_channel_preference?: string;
          alert_lead_days?: number;
          auth_provider?: string;
          avatar_url?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          email?: string;
          first_scan_completed_at?: string | null;
          google_id?: string | null;
          id?: string;
          language?: Database["public"]["Enums"]["user_language"];
          last_active_at?: string;
          name?: string | null;
          onboarding_completed_at?: string | null;
          phone?: string | null;
          phone_verified?: boolean;
          quiet_hours_end?: string;
          quiet_hours_start?: string;
          razorpay_customer_id?: string | null;
          telegram_chat_id?: number | null;
          telegram_linked_at?: string | null;
          telegram_username?: string | null;
          tier?: Database["public"]["Enums"]["user_tier"];
          tier_expires_at?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          alternative_service_ids: string[] | null;
          available_countries: string[];
          cancel_difficulty: number;
          cancel_url: string | null;
          category: string;
          created_at: string;
          default_amounts_inr: number[] | null;
          default_billing_cycle:
            | Database["public"]["Enums"]["billing_cycle"]
            | null;
          description: string | null;
          id: string;
          is_active: boolean;
          logo_url: string;
          name: string;
          regex_patterns: Json;
          updated_at: string;
        };
        Insert: {
          alternative_service_ids?: string[] | null;
          available_countries?: string[];
          cancel_difficulty?: number;
          cancel_url?: string | null;
          category: string;
          created_at?: string;
          default_amounts_inr?: number[] | null;
          default_billing_cycle?:
            | Database["public"]["Enums"]["billing_cycle"]
            | null;
          description?: string | null;
          id: string;
          is_active?: boolean;
          logo_url: string;
          name: string;
          regex_patterns?: Json;
          updated_at?: string;
        };
        Update: {
          alternative_service_ids?: string[] | null;
          available_countries?: string[];
          cancel_difficulty?: number;
          cancel_url?: string | null;
          category?: string;
          created_at?: string;
          default_amounts_inr?: number[] | null;
          default_billing_cycle?:
            | Database["public"]["Enums"]["billing_cycle"]
            | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          logo_url?: string;
          name?: string;
          regex_patterns?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          amount: number;
          amount_inr: number;
          billing_cycle: Database["public"]["Enums"]["billing_cycle"];
          confidence_score: number | null;
          created_at: string;
          currency: string;
          detection_source: Database["public"]["Enums"]["detection_source"];
          first_charge_date: string | null;
          id: string;
          is_trial: boolean;
          last_charge_date: string | null;
          last_usage_date: string | null;
          manual_name: string | null;
          next_renewal_date: string | null;
          service_id: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at: string | null;
          updated_at: string;
          user_category: string | null;
          user_id: string;
          user_notes: string | null;
        };
        Insert: {
          amount: number;
          amount_inr: number;
          billing_cycle: Database["public"]["Enums"]["billing_cycle"];
          confidence_score?: number | null;
          created_at?: string;
          currency?: string;
          detection_source?: Database["public"]["Enums"]["detection_source"];
          first_charge_date?: string | null;
          id?: string;
          is_trial?: boolean;
          last_charge_date?: string | null;
          last_usage_date?: string | null;
          manual_name?: string | null;
          next_renewal_date?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at?: string | null;
          updated_at?: string;
          user_category?: string | null;
          user_id: string;
          user_notes?: string | null;
        };
        Update: {
          amount?: number;
          amount_inr?: number;
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"];
          confidence_score?: number | null;
          created_at?: string;
          currency?: string;
          detection_source?: Database["public"]["Enums"]["detection_source"];
          first_charge_date?: string | null;
          id?: string;
          is_trial?: boolean;
          last_charge_date?: string | null;
          last_usage_date?: string | null;
          manual_name?: string | null;
          next_renewal_date?: string | null;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at?: string | null;
          updated_at?: string;
          user_category?: string | null;
          user_id?: string;
          user_notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      v_upcoming_renewals: {
        Row: {
          alert_lead_days: number | null;
          amount_inr: number | null;
          days_until_renewal: number | null;
          language: Database["public"]["Enums"]["user_language"] | null;
          next_renewal_date: string | null;
          quiet_hours_end: string | null;
          quiet_hours_start: string | null;
          subscription_id: string | null;
          telegram_chat_id: number | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      v_user_dashboard: {
        Row: {
          active_subs_count: number | null;
          active_trials: number | null;
          annual_monthly_equiv: number | null;
          monthly_total_inr: number | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      alert_channel: "telegram" | "email" | "push";
      alert_status: "pending" | "sent" | "delivered" | "failed" | "clicked";
      alert_type:
        | "renewal_3day"
        | "renewal_1day"
        | "trial_ending_7day"
        | "trial_ending_1day"
        | "price_hike"
        | "duplicate_detected"
        | "failed_payment";
      billing_cycle:
        | "weekly"
        | "monthly"
        | "quarterly"
        | "semi_annual"
        | "annual"
        | "lifetime"
        | "unknown";
      detection_source:
        | "gmail"
        | "manual"
        | "card_pdf"
        | "apple_store"
        | "google_play";
      scan_status: "queued" | "running" | "completed" | "failed" | "partial";
      subscription_status:
        | "active"
        | "cancelled"
        | "paused"
        | "expired"
        | "trial";
      user_language: "en" | "hi" | "ta" | "te" | "bn" | "mr";
      user_tier: "free" | "premium" | "premium_plus" | "family" | "lifetime";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      alert_channel: ["telegram", "email", "push"],
      alert_status: ["pending", "sent", "delivered", "failed", "clicked"],
      alert_type: [
        "renewal_3day",
        "renewal_1day",
        "trial_ending_7day",
        "trial_ending_1day",
        "price_hike",
        "duplicate_detected",
        "failed_payment",
      ],
      billing_cycle: [
        "weekly",
        "monthly",
        "quarterly",
        "semi_annual",
        "annual",
        "lifetime",
        "unknown",
      ],
      detection_source: [
        "gmail",
        "manual",
        "card_pdf",
        "apple_store",
        "google_play",
      ],
      scan_status: ["queued", "running", "completed", "failed", "partial"],
      subscription_status: [
        "active",
        "cancelled",
        "paused",
        "expired",
        "trial",
      ],
      user_language: ["en", "hi", "ta", "te", "bn", "mr"],
      user_tier: ["free", "premium", "premium_plus", "family", "lifetime"],
    },
  },
} as const;
