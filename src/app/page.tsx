import { PantryPlanner } from "@/components/pantry-planner";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Just In Case",
      url: "https://justincase.scot/",
      description: "A UK emergency food calculator and just-in-case pantry planner."
    },
    {
      "@type": "WebApplication",
      name: "Just In Case pantry planner",
      url: "https://justincase.scot/",
      description: "A free UK tool that calculates long-life food quantities by household size, weeks of supply, budget, dietary filters, calories and storage.",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" }
    },
    {
      "@type": "Organization",
      name: "AI Scotland Productions",
      url: "https://aiscotlandproductions.com"
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What foods last longest in storage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dried staples such as rice, pasta, oats, lentils, oils, and many tinned foods can last from 12 months to several years when stored properly.",
      },
    },
    {
      "@type": "Question",
      name: "How many calories do I need for my household?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This planner uses 2,000 calories per adult per day and counts each child as 0.6 of an adult for a simple household emergency planning baseline.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a month of emergency food cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Costs vary by household size and food choices. The planner shows how far your budget really goes and where trade-offs appear.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best value emergency food?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best value foods tend to be calorie-dense, shelf-stable, and compact to store, but a sensible pantry also needs balance across staples, protein, fats, vegetables, morale, and micronutrients.",
      },
    },
    {
      "@type": "Question",
      name: "How much storage space do I need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool estimates storage volume in litres for every item so you can see how much room your emergency pantry will take up.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PantryPlanner />
    </>
  );
}
