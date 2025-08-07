import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TestimonialGenerator } from "./testimonial-generator";

const testimonials = [
  {
    quote: "Working with BizHome was a game-changer. Their strategic insights helped us double our revenue in just six months. Highly recommended!",
    name: "Jane Doe",
    title: "CEO, Innovate Inc.",
    initials: "JD",
    hint: "woman portrait"
  },
  {
    quote: "The level of professionalism and dedication from the BizHome team is unmatched. They truly care about their clients' success.",
    name: "John Smith",
    title: "Marketing Director, Solutions Co.",
    initials: "JS",
    hint: "man portrait"
  },
  {
    quote: "Their data analytics service provided clarity we never had before. We're now making smarter, more confident decisions.",
    name: "Samantha Lee",
    title: "COO, Future Forward",
    initials: "SL",
    hint: "business woman"
  },
  {
    quote: "A truly seamless experience from start to finish. The team was responsive, knowledgeable, and delivered beyond our expectations.",
    name: "Alex Johnson",
    title: "Founder, Tech startups",
    initials: "AJ",
    hint: "person smiling"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-20 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">What Our Clients Say</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Real stories from businesses we've helped to succeed.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2">
                <div className="p-2 h-full">
                  <Card className="h-full flex flex-col justify-between p-6">
                    <CardContent className="p-0 flex flex-col justify-between flex-grow">
                      <blockquote className="text-lg italic mb-6 text-foreground/80">"{testimonial.quote}"</blockquote>
                      <div className="flex items-center gap-4 mt-auto">
                        <Avatar>
                          <AvatarImage src={`https://placehold.co/40x40.png`} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                          <AvatarFallback>{testimonial.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        <div className="mt-24">
          <TestimonialGenerator />
        </div>
      </div>
    </section>
  );
}
