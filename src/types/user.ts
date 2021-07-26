export interface EditUserClientPayload {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  countryOfOrigin?: string | null;
  aboutMe?: string;
  dashboardType: number;
  tags?: string;
}
