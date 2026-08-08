import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { initialsAvatarDataUri } from "@/lib/utils/initials-avatar";
import type { Testimonial } from "@/lib/services/testimonialService";

export function TestimonialsDisplay({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) {
    return (
      <p className="mx-auto max-w-md py-16 text-center text-muted-foreground">
        Be the first to share your WVFA story — sign in and leave a testimonial from your profile
        page.
      </p>
    );
  }

  return (
    <AnimatedTestimonials
      testimonials={testimonials.map((t) => ({
        quote: t.quote,
        name: t.author_name,
        designation: t.designation,
        src: initialsAvatarDataUri(t.author_name),
      }))}
      autoplay
    />
  );
}
