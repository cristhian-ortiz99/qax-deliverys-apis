export interface postBody {
  title: string;
  body: string;
  userId: number
}

export interface postResponse {
  title: string | null;
  body: string | null;
  userId: number;
  id: number;
}


