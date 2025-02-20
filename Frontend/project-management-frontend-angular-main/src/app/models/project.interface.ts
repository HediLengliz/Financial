export interface Project {
  id?: number;
  name: string;
  description: string;
  status: string;       // e.g., 'pending', 'active', 'completed'
  priority: string;     // e.g., 'low', 'medium', 'high'
  startDate: string;    // ISO date format (YYYY-MM-DD)
  endDate: string;      // ISO date format (YYYY-MM-DD)
  imagePath?: string;

// For storing the uploaded image path
}
