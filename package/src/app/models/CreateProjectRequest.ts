export interface CreateProjectRequest {
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;    // ISO format (YYYY-MM-DD)
  endDate: string;      // ISO format (YYYY-MM-DD)
  imageFile: File;      // File to upload
}
