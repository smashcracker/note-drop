import { MetadataRoute } from "next";
// import pages from "../data/pages.json"; // REMOVED
import { getAllPageSlugs } from "@/lib/page-store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://note.dropeco.dev";

    const pageSlugs = await getAllPageSlugs();
    const routes = pageSlugs.map((slug) => ({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        ...routes,
    ];
}
