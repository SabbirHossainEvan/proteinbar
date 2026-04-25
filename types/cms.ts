export type WebsitePageStatus = "draft" | "published";
export type WebsitePageKind = "system" | "custom" | "legal";
export type WebsiteSectionType =
  | "richText"
  | "imageText"
  | "cards"
  | "stats"
  | "testimonials"
  | "faq"
  | "ctaBanner"
  | "contactInfo"
  | "dynamicEmbed";

export interface WebsiteRepeaterItem {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  label?: string;
  link?: string;
  value?: string;
  image?: string;
}

export interface WebsitePageSection {
  id: string;
  sectionKey: string;
  sectionType: WebsiteSectionType;
  isVisible: boolean;
  sortOrder: number;
  heading: string;
  body: string;
  eyebrow?: string;
  image?: string;
  buttonLabel?: string;
  buttonLink?: string;
  items: WebsiteRepeaterItem[];
}

export interface WebsitePageRecord {
  id: string;
  slug: string;
  title: string;
  navLabel: string;
  summary: string;
  kind: WebsitePageKind;
  status: WebsitePageStatus;
  showInTopNav: boolean;
  heroEyebrow?: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroBody?: string;
  heroImage?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaLink?: string;
  seoTitle: string;
  seoDescription: string;
  sections: WebsitePageSection[];
  updatedAt: string;
}

