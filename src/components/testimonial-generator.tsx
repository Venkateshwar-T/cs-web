'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleGenerateVariations } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, RefreshCw, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  message: '',
  errors: null,
  variations: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Variations
    </Button>
  );
}

export function TestimonialGenerator() {
  const [state, formAction] = useFormState(handleGenerateVariations, initialState);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Copied to clipboard!",
    });
    const timer = setTimeout(() => setCopiedIndex(null), 2000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-primary" />
            AI Testimonial Generator
          </CardTitle>
          <CardDescription>
            Refresh your customer testimonials. Enter an existing testimonial to generate new, authentic-sounding variations for A/B testing and marketing content.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="testimonialText">Original Testimonial</Label>
                <Textarea id="testimonialText" name="testimonialText" placeholder="e.g., 'This product changed my life! It's so easy to use.'" required />
                {state.errors?.testimonialText && <p className="text-sm font-medium text-destructive pt-1">{state.errors.testimonialText[0]}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      {state.message && state.message.startsWith('An unexpected error') && (
          <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
          </Alert>
      )}

      {state.variations && state.variations.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-2xl font-bold text-center font-headline">Generated Variations</h3>
          {state.variations.map((variation, index) => (
            <Card key={index} className="bg-background/50">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <p className="text-muted-foreground italic">"{variation}"</p>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(variation, index)}>
                  {copiedIndex === index ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
