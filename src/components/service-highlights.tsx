import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, BarChart3, Users2 } from "lucide-react";

const services = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Strategic Consulting",
    description: "Tailored strategies to navigate market complexities and drive sustainable growth for your business."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Data-Driven Analytics",
    description: "Unlock actionable insights from your data to make informed decisions and optimize performance."
  },
  {
    icon: <Users2 className="h-10 w-10 text-primary" />,
    title: "Customer Engagement",
    description: "Build lasting relationships with your customers through innovative engagement solutions."
  }
];

export function ServiceHighlights() {
  return (
    <section id="services" className="w-full py-20 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Our Core Services</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover how our expert services can propel your business to new heights.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 transition-transform transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 duration-300">
              <CardHeader>
                {service.icon}
                <CardTitle className="mt-4 font-headline">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
