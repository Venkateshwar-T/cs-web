'use server';

import { generateTestimonialVariations } from '@/ai/flows/generate-testimonial-variations';
import type { GenerateTestimonialVariationsInput } from '@/ai/flows/generate-testimonial-variations';
import { z } from 'zod';

const schema = z.object({
  testimonialText: z.string().min(10, "Please enter a testimonial of at least 10 characters."),
});

type FormState = {
  message: string;
  errors: { testimonialText?: string[] } | null;
  variations: string[];
};

export async function handleGenerateVariations(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = schema.safeParse({
    testimonialText: formData.get('testimonialText'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
      variations: [],
    };
  }
  
  const input: GenerateTestimonialVariationsInput = {
    testimonialText: validatedFields.data.testimonialText,
    numberOfVariations: 3,
  };

  try {
    const result = await generateTestimonialVariations(input);
    return {
      message: 'Success',
      errors: null,
      variations: result.variations,
    };
  } catch (error) {
    console.error('Error generating testimonial variations:', error);
    return {
      message: 'We had trouble generating variations. Please try again later.',
      errors: null,
      variations: [],
    };
  }
}
