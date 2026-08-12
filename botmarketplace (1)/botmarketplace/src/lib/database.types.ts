export interface Database {
  public: {
    Tables: {
      bots: {
        Row: any;
        Insert: any;
        Update: any;
      };
      orders: {
        Row: any;
        Insert: any;
        Update: any;
      };
      users: {
        Row: any;
        Insert: any;
        Update: any;
      };
    };
  };
}