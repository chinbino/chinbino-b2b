export class CreateContentDto {
  type: string;
  slug: string;
  status: string;
  title: {
    fa: string;
    en?: string;
  };
}

export class UpdateContentDto {
  type?: string;
  slug?: string;
  status?: string;
  title?: {
    fa: string;
    en?: string;
  };
}
