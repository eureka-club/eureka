export interface EditUserClientPayload {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  countryOfOrigin?: string | null;
  tags?: string;
}
