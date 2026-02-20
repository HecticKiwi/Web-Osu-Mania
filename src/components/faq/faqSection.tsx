import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/routes/faq";
import type { ReactNode } from "react";

export function FaqSection({
  icon,
  title,
  description,
  items,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  items: FaqItem[];
}) {
  return (
    <section className="relative">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      <div className="border-border/60 bg-card rounded-xl border">
        <Accordion type="single" collapsible className="w-full divide-y">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="px-6">
              <AccordionTrigger className="hover:text-primary py-5 font-medium tracking-tight hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
