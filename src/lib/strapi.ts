const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");
const DEFAULT_STRAPI_URL = "https://dreams-cms.onrender.com";
const STRAPI_REQUEST_TIMEOUT_MS = 15000;
const STRAPI_MAX_RETRIES = 4;

const resolveStrapiUrl = () => {
  const configuredUrl = import.meta.env.VITE_STRAPI_URL?.trim();

  if (configuredUrl) {
    return normalizeBaseUrl(configuredUrl);
  }

  return DEFAULT_STRAPI_URL;
};

export const STRAPI_URL = resolveStrapiUrl();
export const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || "";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetriableStatus = (status: number) =>
  [408, 425, 429, 500, 502, 503, 504].includes(status);

const isRetriableError = (error: unknown) =>
  error instanceof TypeError || (error instanceof DOMException && error.name === "AbortError");

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
  const url = new URL(`${STRAPI_URL}/api/${endpoint.replace(/^\/+/, "")}`);
  
  // Handle parameters
  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((val: string, index: number) => {
        url.searchParams.append(`${key}[${index}]`, String(val));
      });
    } else {
      url.searchParams.append(key, String(value));
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

  console.log(`Fetching from Strapi: ${url.toString()}`);

  for (let attempt = 0; attempt <= STRAPI_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), STRAPI_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        headers,
        cache: "no-store",
        mode: "cors",
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (attempt < STRAPI_MAX_RETRIES && isRetriableStatus(response.status)) {
          await sleep(Math.min(1000 * 2 ** attempt, 8000));
          continue;
        }

        console.error(`Strapi API Error: ${response.status} ${response.statusText}`, errorData);
        throw new Error(`Strapi API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (attempt < STRAPI_MAX_RETRIES && isRetriableError(error)) {
        await sleep(Math.min(1000 * 2 ** attempt, 8000));
        continue;
      }

      console.error("Failed to connect to Strapi:", error);
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw new Error("Strapi API Error: Request retries exhausted");
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
    heroImage: getStrapiURL(attrs.heroImage?.data?.attributes?.url || attrs.heroImage?.url),
    incomeTaxBannerImage: getStrapiURL(
      attrs.incomeTaxBannerImage?.data?.attributes?.url || attrs.incomeTaxBannerImage?.url
    ),
    whyChoosePoster: getStrapiURL(
      attrs.whyChoosePoster?.data?.attributes?.url || attrs.whyChoosePoster?.url
    ),
    ctaLogos: (attrs.ctaLogos?.data || attrs.ctaLogos || []).map((item: any) =>
      getStrapiURL(item?.attributes?.url || item?.url)
    ),
    whyChoose: attrs.whyChoose || [],
    testimonials: attrs.testimonials || [],
    featuredVideos: attrs.featuredVideos || []
  };
};

export const mapAboutPage = (data: any) => {
  const attrs = data?.data?.attributes || data?.data || {};
  return {
    heroImage: getStrapiURL(attrs.heroImage?.data?.attributes?.url || attrs.heroImage?.url),
    storyImage: getStrapiURL(attrs.storyImage?.data?.attributes?.url || attrs.storyImage?.url)
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

const mapMedia = (media: any) => {
  const asset = media?.data?.attributes || media?.attributes || media?.data || media;
  return asset?.url ? getStrapiURL(asset.url) : undefined;
};

export const mapBulkOrderPage = (data: any) => {
  const attrs = data?.data?.attributes || data?.data || {};

  return {
    bannerImage: getStrapiURL(attrs.bannerImage?.data?.attributes?.url || attrs.bannerImage?.url),
    whoWeServe: (attrs.whoWeServe || []).map((item: any) => ({
      title: item.title,
      description: item.description,
      icon: mapMedia(item.icon),
    })),
    furnitureCategories: (attrs.furnitureCategories || []).map((item: any) => ({
      title: item.title,
      description: item.description,
      image: mapMedia(item.image),
    })),
    whyChooseUs: (attrs.whyChooseUs || []).map((item: any) => ({
      title: item.title,
      description: item.description || item.desc,
      icon: item.icon,
    })),
    processSteps: (attrs.processSteps || []).map((item: any) => ({
      stepTitle: item.stepTitle,
      stepDescription: item.stepDescription,
    })),
    galleryImages: (attrs.galleryImages?.data || attrs.galleryImages || []).map((item: any) =>
      getStrapiURL(item?.attributes?.url || item?.url)
    ),
    ctaTitle: attrs.ctaTitle,
    ctaDescription: attrs.ctaDescription,
  };
};
