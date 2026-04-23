import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { product } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in environment" }, { status: 500 });
    }

    const prompt = `You are an expert SEO specialist for Ethnicaa, a wholesale ethnic wear marketplace based in Surat, India. 
Generate optimized SEO content for this product. Respond ONLY with valid JSON, no markdown, no explanation.

Product details:
- Name: ${product.name}
- Category: ${product.categoryNames?.[0] || product.category}
- Fabric: ${product.fabricNames?.[0] || product.fabric}
- Catalog: ${product.catalog || "General"}
- Price: ₹${product.price || product.avg_price}

Generate:
{
  "metaTitle": "SEO title, 50-60 chars, include product type + wholesale + Surat",
  "metaDescription": "160 char meta desc, include price range, wholesale, reseller angle, CTA",
  "productDescription": "100-150 word product description with SEO keywords naturally included. Mention fabric, occasion, wholesale price, Surat manufacturer, reseller benefits.",
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
      "price": "${product.price || product.avg_price}",
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
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "{}";
    
    // Clean JSON if needed
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const cleanJson = text.substring(jsonStart, jsonEnd);

    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
