import type { WebsitePageRecord, WebsitePageSection } from "@/types/cms";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

const defaultHomePage: WebsitePageRecord = {
  id: "home",
  slug: "home",
  title: "Home",
  navLabel: "Home",
  summary: "Homepage hero, trust-building content, and conversion sections.",
  kind: "system",
  status: "published",
  showInTopNav: true,
  heroEyebrow: "Since 2018",
  heroTitle: "The Real Food Revolution",
  heroSubtitle:
    "Fresh ingredients. No oil. No trans fat. Casablanca's favorite healthy restaurant since 2018.",
  heroBody:
    "Manage homepage text, images, CTAs, and every major section from the admin dashboard.",
  heroImage: "/hero.png",
  heroPrimaryCtaLabel: "See Our Menu",
  heroPrimaryCtaLink: "/pages/menu",
  heroSecondaryCtaLabel: "Start A Monthly Plan",
  heroSecondaryCtaLink: "/plans",
  seoTitle: "Proteinbar | Healthy Meals & Meal Plans",
  seoDescription: "Fresh meals, flexible plans, and delivery that fits your week.",
  updatedAt: new Date("2026-04-25T00:00:00.000Z").toISOString(),
  sections: [
    {
      id: "home-intro",
      sectionKey: "intro-statement",
      sectionType: "richText",
      isVisible: true,
      sortOrder: 0,
      heading: "Intro Statement",
      body:
        "Founded in 2018, Proteinbar is dedicated to offering a wide array of wholesome and nutritious meals. Our restaurant prides itself on crafting delicious dishes that prioritize health and well-being, catering to a diverse clientele seeking flavorful options that support a balanced lifestyle.",
      buttonLabel: "See Our Menu",
      buttonLink: "/pages/menu",
      items: []
    },
    {
      id: "home-locations-preview",
      sectionKey: "locations-preview",
      sectionType: "dynamicEmbed",
      isVisible: true,
      sortOrder: 1,
      heading: "Our Locations",
      body: "Manage this heading and support text here while the actual location cards stay synced from the Locations module.",
      items: []
    },
    {
      id: "home-mission",
      sectionKey: "mission",
      sectionType: "cards",
      isVisible: true,
      sortOrder: 2,
      heading: "Our Mission",
      body:
        "Proteinbar's core vision and mission is not just about providing delicious healthy meals to its customers, but also providing and promoting good health and make it accessible to whoever, wherever.",
      items: [
        { id: "mission-1", title: "Delicious & Healthy", body: "Provide delicious healthy meals to customers." },
        { id: "mission-2", title: "Promote good health", body: "Encourage well-being and fitness." },
        { id: "mission-3", title: "Accessibility", body: "Make health accessible to everyone, everywhere." }
      ]
    },
    {
      id: "home-experience",
      sectionKey: "experience",
      sectionType: "cards",
      isVisible: true,
      sortOrder: 3,
      heading: "THE PROTEINBAR EXPERIENCE",
      body: "",
      items: [
        { id: "experience-1", title: "See Our Menu", label: "see Menu", link: "/pages/menu", image: "/location-2.png" },
        { id: "experience-2", title: "Need A Meal Plan", label: "Contact Us", link: "/pages/contact", image: "/location-1.png" },
        { id: "experience-3", title: "Catering Experiences", label: "Contact Us", link: "/pages/contact", image: "/hero.png" }
      ]
    },
    {
      id: "home-brand-values",
      sectionKey: "brand-values",
      sectionType: "cards",
      isVisible: true,
      sortOrder: 4,
      heading: "PROTEINBAR",
      body: "Brand values and promises.",
      items: [
        { id: "value-1", title: "HONEST BUSINESS", body: "Fair trade practices and full transparency to earn your trust every step of the way.", image: "/icon/icon-1.webp" },
        { id: "value-2", title: "FRESH & HEALTHY FOOD", body: "Experience the goodness of our fresh, locally sourced ingredients promoting a healthier lifestyle.", image: "/icon/icon-2.webp" },
        { id: "value-3", title: "NO OIL", body: "Our meals are light, clean, and perfect for a balanced diet.", image: "/icon/icon-3.webp" },
        { id: "value-4", title: "COST-EFFECTIVE", body: "Get nutritious meals that do not break the bank to suit every budget & preference.", image: "/icon/icon-4.webp" },
        { id: "value-5", title: "MADE WITH LOVE", body: "Prepared with care and passion, every meal reflects our dedication to quality.", image: "/icon/icon-5.webp" },
        { id: "value-6", title: "NO TRANS FAT", body: "Our meals are oil-free, healthy, and full of flavor.", image: "/icon/icon-6.webp" }
      ]
    },
    {
      id: "home-healthy-customers",
      sectionKey: "healthy-customers",
      sectionType: "cards",
      isVisible: true,
      sortOrder: 5,
      heading: "6 Years Of Happy Healthy Customers And Counting...",
      body: "",
      items: [
        { id: "healthy-1", title: "", image: "/healthy/image-1.png" },
        { id: "healthy-2", title: "", image: "/healthy/image-2.png" },
        { id: "healthy-3", title: "", image: "/healthy/image-3.png" },
        { id: "healthy-4", title: "", image: "/healthy/image-4.png" },
        { id: "healthy-5", title: "", image: "/healthy/image-5.png" },
        { id: "healthy-6", title: "", image: "/healthy/image-6.png" },
        { id: "healthy-7", title: "", image: "/healthy/image-7.png" },
        { id: "healthy-8", title: "", image: "/healthy/image-5.png" },
        { id: "healthy-9", title: "", image: "/healthy/image-4.png" },
        { id: "healthy-10", title: "", image: "/healthy/image-1.png" },
        { id: "healthy-11", title: "", image: "/healthy/image-6.png" },
        { id: "healthy-12", title: "", image: "/healthy/image-2.png" }
      ]
    },
    {
      id: "home-testimonials",
      sectionKey: "testimonials",
      sectionType: "testimonials",
      isVisible: true,
      sortOrder: 6,
      heading: "Google Reviews",
      body: "Google Reviews *****",
      items: [
        { id: "testimonial-1", title: "Perfect place. Love the concept.", body: "Perfect place. Love the concept. Love the food. Friendly employees also.", subtitle: "Jememar" },
        { id: "testimonial-2", title: "Great experience I loved it there..", body: "Great experience I loved it there.. The menu comes with different dishes and calories count.. perfect for athletes.. it also says that it is made from athletes to athletes.. The cheesecake there is a real piece of art .. so delicious and perfectly baked..", subtitle: "Chaimaa Boutjim" },
        { id: "testimonial-3", title: "Amazing quality and super clean place.", body: "I always find fresh options and the staff are very friendly. The portions are good and the service is fast.", subtitle: "Salma R." },
        { id: "testimonial-4", title: "Best healthy food spot in town.", body: "Great atmosphere and delicious meals. It is one of my favorite places after workouts.", subtitle: "Karim N." }
      ]
    }
  ]
};

export function getDefaultHomePage() {
  return defaultHomePage;
}

export function getHomeSection(page: WebsitePageRecord, sectionKey: string): WebsitePageSection | undefined {
  return page.sections.find((section) => section.sectionKey === sectionKey);
}

async function fetchWebsitePage(slug: string, fallback: WebsitePageRecord): Promise<WebsitePageRecord> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:5000/api/v1";

  try {
    const response = await fetch(`${baseUrl}/public/website-pages/${slug}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as ApiResponse<WebsitePageRecord>;
    return payload.data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchHomePageContent(): Promise<WebsitePageRecord> {
  return fetchWebsitePage("home", defaultHomePage);
}

export async function fetchWebsitePageContent(slug: string): Promise<WebsitePageRecord | null> {
  const fallbackPages: Record<string, WebsitePageRecord> = {
    home: defaultHomePage,
    "about-us": {
      id: "about-us",
      slug: "about-us",
      title: "About Us",
      navLabel: "About Us",
      summary: "Brand story and trust-building content.",
      kind: "system",
      status: "published",
      showInTopNav: true,
      heroEyebrow: "Our Story",
      heroTitle: "About us",
      heroSubtitle: "",
      heroBody: "",
      heroImage: "/hero.png",
      heroPrimaryCtaLabel: "",
      heroPrimaryCtaLink: "",
      heroSecondaryCtaLabel: "",
      heroSecondaryCtaLink: "",
      seoTitle: "About Proteinbar",
      seoDescription: "Learn more about Proteinbar.",
      updatedAt: new Date("2026-04-25T00:00:00.000Z").toISOString(),
      sections: []
    },
    contact: {
      id: "contact",
      slug: "contact",
      title: "Contact",
      navLabel: "Contact",
      summary: "Support and contact page content.",
      kind: "system",
      status: "published",
      showInTopNav: true,
      heroEyebrow: "Get In Touch",
      heroTitle: "Contact Us",
      heroSubtitle: "",
      heroBody: "",
      heroImage: "/hero.png",
      heroPrimaryCtaLabel: "",
      heroPrimaryCtaLink: "",
      heroSecondaryCtaLabel: "",
      heroSecondaryCtaLink: "",
      seoTitle: "Contact Proteinbar",
      seoDescription: "Reach Proteinbar for support or questions.",
      updatedAt: new Date("2026-04-25T00:00:00.000Z").toISOString(),
      sections: []
    },
    menu: {
      id: "menu",
      slug: "menu",
      title: "Menu",
      navLabel: "Menu",
      summary: "Hero and supporting CMS content around the menu.",
      kind: "system",
      status: "published",
      showInTopNav: true,
      heroEyebrow: "Discover",
      heroTitle: "Menu",
      heroSubtitle: "",
      heroBody: "",
      heroImage: "/location_hero.png",
      heroPrimaryCtaLabel: "",
      heroPrimaryCtaLink: "",
      heroSecondaryCtaLabel: "",
      heroSecondaryCtaLink: "",
      seoTitle: "Proteinbar Menu",
      seoDescription: "Browse menu categories and featured meals.",
      updatedAt: new Date("2026-04-25T00:00:00.000Z").toISOString(),
      sections: []
    },
    locations: {
      id: "locations",
      slug: "locations",
      title: "Locations",
      navLabel: "Locations",
      summary: "Hero and support copy for the locations page.",
      kind: "system",
      status: "published",
      showInTopNav: true,
      heroEyebrow: "Visit Us",
      heroTitle: "Locations",
      heroSubtitle: "",
      heroBody: "",
      heroImage: "/location_hero.png",
      heroPrimaryCtaLabel: "",
      heroPrimaryCtaLink: "",
      heroSecondaryCtaLabel: "",
      heroSecondaryCtaLink: "",
      seoTitle: "Proteinbar Locations",
      seoDescription: "Pickup points, delivery zones, and branch guidance.",
      updatedAt: new Date("2026-04-25T00:00:00.000Z").toISOString(),
      sections: [
        {
          id: "locations-delivery-overview",
          sectionKey: "delivery-overview",
          sectionType: "stats",
          isVisible: true,
          sortOrder: 0,
          heading: "2 Locations & Delivery All Over Casablanca",
          body:
            "Besides Our 2 Locations, We Focus Bringing Healthy, Delicious Meals Right To Your Doorstep, Wherever You Are In Casablanca.",
          image: "/healthy/image-7.png",
          items: [
            { id: "delivery-stat-1", title: "Staff Members", value: "14", subtitle: "+", body: "users" },
            { id: "delivery-stat-2", title: "Opens everyday", value: "7", subtitle: "/7", body: "calendar" },
            { id: "delivery-stat-3", title: "Positive Reviews", value: "411", subtitle: "+", body: "thumbs-up" }
          ]
        }
      ]
    },
    "terms-and-conditions": {
      id: "terms",
      slug: "terms-and-conditions",
      title: "Terms & Conditions",
      navLabel: "Terms",
      summary: "Legal terms for website use, ordering, delivery, and subscriptions.",
      kind: "legal",
      status: "published",
      showInTopNav: false,
      heroEyebrow: "Legal",
      heroTitle: "Terms & Conditions",
      heroSubtitle:
        "These terms explain the basic rules, responsibilities, and service conditions that apply when using Proteinbar, placing orders, or purchasing meal plans through our website.",
      heroBody:
        "These terms explain the basic rules, responsibilities, and service conditions that apply when using Proteinbar, placing orders, or purchasing meal plans through our website.",
      heroImage: "/hero.png",
      heroPrimaryCtaLabel: "",
      heroPrimaryCtaLink: "",
      heroSecondaryCtaLabel: "",
      heroSecondaryCtaLink: "",
      seoTitle: "Proteinbar Terms & Conditions",
      seoDescription: "Read the ordering, delivery, and subscription terms.",
      updatedAt: new Date("2026-04-26T00:00:00.000Z").toISOString(),
      sections: [
        {
          id: "terms-section-1",
          sectionKey: "use-of-website",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 0,
          heading: "Use Of Website",
          body:
            "By using the Proteinbar website, you agree to use it only for lawful purposes and in a way that does not interfere with the experience, security, or availability of the platform for other users.",
          items: []
        },
        {
          id: "terms-section-2",
          sectionKey: "orders-and-availability",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 1,
          heading: "Orders And Availability",
          body:
            "All orders are subject to availability, operational capacity, and confirmation. We reserve the right to update menu items, meal plan options, pricing, and availability without prior notice.",
          items: []
        },
        {
          id: "terms-section-3",
          sectionKey: "pricing",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 2,
          heading: "Pricing",
          body:
            "Prices displayed on the website are provided in good faith and may change when required. Taxes, delivery fees, or applicable service charges may be added depending on the order type and delivery zone.",
          items: []
        },
        {
          id: "terms-section-4",
          sectionKey: "meal-plans-and-custom-selections",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 3,
          heading: "Meal Plans And Custom Selections",
          body:
            "Meal plan and custom meal selections are based on the options available at the time of purchase. Product composition, macros, and ingredients may vary when supply or operational needs require substitutions.",
          items: []
        },
        {
          id: "terms-section-5",
          sectionKey: "cancellations-and-changes",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 4,
          heading: "Cancellations And Changes",
          body:
            "Requests to change or cancel an order are handled based on preparation status, delivery scheduling, and operational feasibility. Once preparation has started, changes may be limited or unavailable.",
          items: []
        },
        {
          id: "terms-section-6",
          sectionKey: "allergies-and-dietary-responsibility",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 5,
          heading: "Allergies And Dietary Responsibility",
          body:
            "Customers are responsible for reviewing ingredient and nutrition information before ordering. If you have allergies, intolerances, or specific dietary restrictions, please contact us before completing your purchase.",
          items: []
        },
        {
          id: "terms-section-7",
          sectionKey: "liability",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 6,
          heading: "Liability",
          body:
            "Proteinbar is not liable for indirect, incidental, or consequential damages resulting from use of the website, order delays, third-party service interruptions, or circumstances outside our reasonable control.",
          items: []
        },
        {
          id: "terms-section-8",
          sectionKey: "changes-to-these-terms",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 7,
          heading: "Changes To These Terms",
          body:
            "We may revise these Terms & Conditions from time to time. Continued use of the website or services after updates means you agree to the revised terms.",
          items: []
        }
      ]
    },
    "privacy-policy": {
      id: "privacy",
      slug: "privacy-policy",
      title: "Privacy Policy",
      navLabel: "Privacy",
      summary: "Privacy disclosures for customer accounts, contact data, and order history.",
      kind: "legal",
      status: "published",
      showInTopNav: false,
      heroEyebrow: "Legal",
      heroTitle: "Privacy Policy",
      heroSubtitle:
        "This page explains how Proteinbar collects, uses, and protects personal information when you use our website, place orders, or interact with our services.",
      heroBody:
        "This page explains how Proteinbar collects, uses, and protects personal information when you use our website, place orders, or interact with our services.",
      heroImage: "/hero.png",
      heroPrimaryCtaLabel: "",
      heroPrimaryCtaLink: "",
      heroSecondaryCtaLabel: "",
      heroSecondaryCtaLink: "",
      seoTitle: "Proteinbar Privacy Policy",
      seoDescription: "Understand how Proteinbar stores and uses customer data.",
      updatedAt: new Date("2026-04-26T00:00:00.000Z").toISOString(),
      sections: [
        {
          id: "privacy-section-1",
          sectionKey: "information-we-collect",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 0,
          heading: "Information We Collect",
          body:
            "We may collect information you provide directly when you place an order, create a meal plan, contact us, or subscribe to updates. This can include your name, email address, phone number, delivery details, and order preferences.",
          items: []
        },
        {
          id: "privacy-section-2",
          sectionKey: "how-we-use-your-information",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 1,
          heading: "How We Use Your Information",
          body:
            "We use your information to process orders, manage deliveries, support your account experience, respond to inquiries, and improve our menu, meal plans, and customer service experience.",
          items: []
        },
        {
          id: "privacy-section-3",
          sectionKey: "payments-and-orders",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 2,
          heading: "Payments And Orders",
          body:
            "Payment and order information may be used to complete transactions, confirm bookings, prevent fraud, and maintain internal business records related to your purchases.",
          items: []
        },
        {
          id: "privacy-section-4",
          sectionKey: "sharing-of-information",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 3,
          heading: "Sharing Of Information",
          body:
            "We do not sell your personal information. We may share limited information with service providers or operational partners only when needed to process orders, deliver meals, provide support, or comply with legal obligations.",
          items: []
        },
        {
          id: "privacy-section-5",
          sectionKey: "data-security",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 4,
          heading: "Data Security",
          body:
            "We take reasonable steps to protect personal information using appropriate technical and organizational measures. However, no online system can guarantee absolute security.",
          items: []
        },
        {
          id: "privacy-section-6",
          sectionKey: "your-choices",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 5,
          heading: "Your Choices",
          body:
            "You may contact us to request updates or corrections to the personal information you have shared with us. You may also ask questions about how your information is handled.",
          items: []
        },
        {
          id: "privacy-section-7",
          sectionKey: "policy-updates",
          sectionType: "richText",
          isVisible: true,
          sortOrder: 6,
          heading: "Policy Updates",
          body:
            "We may update this Privacy Policy from time to time to reflect operational, legal, or service changes. Continued use of our website or services after updates means you accept the revised policy.",
          items: []
        }
      ]
    }
  };

  const fallback = fallbackPages[slug];
  if (!fallback) return null;
  return fetchWebsitePage(slug, fallback);
}
