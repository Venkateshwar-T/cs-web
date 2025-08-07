import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="hero" className="w-full py-20 md:py-32 lg:py-40 bg-card">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 xl:grid-cols-1">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
                Elevate Your Business with BizHome
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                We provide top-tier solutions to help you grow, innovate, and succeed in today's competitive market. Let's build your future, together.
              </p>
            </div>
            <div id="contact" className="w-full max-w-sm mx-auto pt-4">
               <Button asChild size="lg" className="w-full">
                  <a href="mailto:contact@bizhome.com">Get Started Today</a>
               </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
