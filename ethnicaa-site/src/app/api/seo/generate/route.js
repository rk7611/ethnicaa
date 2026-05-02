import { NextResponse } from "next/server";

function cleanText(value, fallback = "") {
  if (value == null) return fallback;
  return String(value).replace(/[<>]/g, "").slice(0, 500);
}

function safeProduct(input) {
  if (!input || typeof input !== "object") return null;

  return {
    name: cleanText(input.name || input.catalog, ""),
    category: cleanText(input.categoryNames?.[0] || input.category, "Ethnic Wear"),
    fabric: cleanText(input.fabricNames?.[0] || input.fabric, ""),
    catalog: cleanText(input.catalog, "General"),
    price: cleanText(input.price || input.avg_price, ""),
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const product = safeProduct(body.product);
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!product?.name) {
      return NextResponse.json({ error: "Valid product name is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key missing in environment" }, { status: 500 });
    }

    const prompt = `You are an expert SEO, AEO, and GEO specialist for Ethnicaa, a wholesale ethnic wear marketplace based in Surat, India.
Generate optimized content for this product. Respond only with valid JSON, no markdown, no explanation.

Product details:
- Name: ${product.name}
- Category: ${product.category}
- Fabric: ${product.fabric}
- Catalog: ${product.catalog}
- Price: INR ${product.price}

Generate:
{
  "metaTitle": "SEO title, 50-60 chars, include product type + wholesale + Surat",
  "metaDescription": "150-160 char meta description with wholesale, reseller intent, and CTA",
  "productDescription": "100-150 word product description with natural SEO/AEO/GEO wording. Mention fabric, occasion, wholesale price, Surat manufacturer, and reseller benefits.",
  "altText": "Descriptive alt text 10-15 words: fabric + product type + wholesale + Ethnicaa",
  "schemaOrg": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${product.name}",
    "description": "brief schema description",
    "brand": {"@type": "Brand", "name": "${product.catalog || "Ethnicaa"}"},
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": "${product.price}",
      "availability": "https://schema.org/InStock",
      "seller": {"@type": "Organization", "name": "Ethnicaa Wholesale"}
    }
  },
  "seoScore": 95,
  "keywordsTargeted": ["keyword1", "keyword2", "keyword3"]
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const providerMessage = data?.error?.message || "SEO provider request failed";
      return NextResponse.json({ error: providerMessage }, { status: response.status });
    }

    const text = data.content?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: "SEO provider returned an empty response" }, { status: 502 });
    }

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart < 0 || jsonEnd <= jsonStart) {
      return NextResponse.json({ error: "SEO provider did not return JSON" }, { status: 502 });
    }

    const parsed = JSON.parse(text.substring(jsonStart, jsonEnd));

    return NextResponse.json({
      metaTitle: cleanText(parsed.metaTitle, product.name).slice(0, 70),
      metaDescription: cleanText(parsed.metaDescription, "").slice(0, 180),
      productDescription: cleanText(parsed.productDescription, "").slice(0, 1200),
      altText: cleanText(parsed.altText, `${product.name} wholesale Ethnicaa`).slice(0, 180),
      schemaOrg: parsed.schemaOrg && typeof parsed.schemaOrg === "object" ? parsed.schemaOrg : null,
      seoScore: Number(parsed.seoScore) || 0,
      keywordsTargeted: Array.isArray(parsed.keywordsTargeted)
        ? parsed.keywordsTargeted.map((keyword) => cleanText(keyword).slice(0, 80)).filter(Boolean).slice(0, 10)
        : [],
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
