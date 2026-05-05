export default function FAQSchema({ faqs = [], id = "faq-schema" }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question || faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || faq.a,
      },
    })),
  };

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
