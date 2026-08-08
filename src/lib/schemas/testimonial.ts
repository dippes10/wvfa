import { z } from "zod";

export const testimonialSubmitSchema = z.object({
  designation: z.string().min(1, "Tell us who you are (e.g. Parent, Player)").max(60),
  quote: z.string().min(20, "A few more words would help other families").max(600),
});

export type TestimonialSubmitInput = z.infer<typeof testimonialSubmitSchema>;
