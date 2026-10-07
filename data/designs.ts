export type DesignItem = {
  id: string;
  title: string;
  category: string;
  year?: string;
  description: string;
  tools?: string[];
  link?: string;
  status?: string;
};

// Sourced from creative design work — ready for future visual artifacts
export const designs: DesignItem[] = [];
