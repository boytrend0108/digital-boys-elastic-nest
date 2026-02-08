export class CreateMovieDto {
  name: string;
  title: string;
  description: string;
}

export interface MovieDocument {
  name: string;
  title: string;
  description: string;
  suggest: string[];
}
