import { experiments } from "@/data/experiments";

export default async function sitemap() {
  let routes = ["", "/lab", "/about"].map((route) => ({
    url: `https://biki.dev${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const filteredExperiments = experiments.filter(
    (experiment) => experiment.type === "internal" || experiment.mdx
  );

  let experimentPages = filteredExperiments.map((experiment) => ({
    url: `https://biki.dev/lab/${experiment.slug}`,
    lastModified: experiment.publishedAt,
  }));

  return [...routes, ...experimentPages];
}
