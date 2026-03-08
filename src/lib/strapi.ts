export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://127.0.0.1:1337";
export const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || "";

/**
 * Helper to get the full Strapi URL for media
 */
export const getStrapiURL = (path: string | undefined | null) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
};

/**
 * Generic fetcher for Strapi API
 */
export const fetchStrapi = async (endpoint: string, params: Record<string, any> = {}) => {
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);
  
  // Handle parameters
  Object.keys(params).forEach((key) => {
    if (Array.isArray(params[key])) {
      params[key].forEach((val: string, index: number) => {
        url.searchParams.append(`${key}[${index}]`, val);
      });
    } else {
      url.searchParams.append(key, params[key]);
    }
  });

  // Default populate if not specified
  if (!url.searchParams.toString().includes("populate")) {
    url.searchParams.append("populate", "*");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
  }

  try {
    console.log(`Fetching from Strapi: ${url.toString()}`);
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Strapi API Error: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Strapi API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to connect to Strapi:", error);
    throw error;
  }
};

export const extractTextFromBlocks = (blocks: any) => {
  if (!blocks) return "";
  if (typeof blocks === 'string') return blocks;
  if (Array.isArray(blocks)) {
    return blocks.map((block: any) => 
      block.children?.map((c: any) => c.text).join("")
    ).join("\n\n");
  }
  return "";
}

/**
 * Mappers
 */
export const mapStrapiProduct = (item: any) => {
  if (!item) return null;
  const data = item.attributes || item;
  
  return {
    id: item.documentId || item.id?.toString() || "",
    name: data.title || data.name,
    category: data.category?.Name || data.category?.data?.attributes?.Name || "General",
    price: data.price,
    originalPrice: data.old_price,
    image: getStrapiURL(data.images?.[0]?.url || data.images?.data?.[0]?.attributes?.url),
    images: (data.images?.data || data.images || []).map((img: any) => 
      getStrapiURL(img.attributes?.url || img.url)
    ),
    description: extractTextFromBlocks(data.description),
    badge: data.badge,
    features: Array.isArray(data.features) ? data.features : [],
    featured: data.featured
  };
};

export const mapStrapiGallery = (item: any) => {
  const data = item.attributes || item;
  const media = data.Media?.data?.attributes || data.Media;
  return getStrapiURL(media?.url);
};

export const mapHomepage = (data: any) => {
  const attrs = data?.data?.attributes || data?.data || {};
  return {
    heroTitle: attrs.heroTitle,
    heroSubtitle: attrs.heroSubtitle,
    heroImage: getStrapiURL(attrs.heroImage?.data?.attributes?.url || attrs.heroImage?.url),
    whyChoose: attrs.whyChoose || [],
    testimonials: attrs.testimonials || []
  };
};

export const mapAboutPage = (data: any) => {
  const attrs = data?.data?.attributes || data?.data || {};
  return {
    heroTitle: attrs.heroTitle,
    heroSubtitle: attrs.heroSubtitle,
    heroImage: getStrapiURL(attrs.heroImage?.data?.attributes?.url || attrs.heroImage?.url),
    storyTitle: attrs.storyTitle,
    storyText: extractTextFromBlocks(attrs.storyText),
    storyImage: getStrapiURL(attrs.storyImage?.data?.attributes?.url || attrs.storyImage?.url),
    stats: attrs.stats || [],
    values: attrs.values || []
  };
};

export const mapContactPage = (data: any) => {
  const attrs = data?.data?.attributes || data?.data || {};
  return {
    title: attrs.title,
    subtitle: attrs.subtitle,
    contactInfo: attrs.contactInfo || []
  };
};
