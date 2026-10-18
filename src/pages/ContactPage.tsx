import PageHero from '../components/PageHero'
import Contact from '../sections/Contact'
import { company, whatsappLink } from '../config/company'

/** The Contact page: a short opening, then the enquiry form beside the ways to reach us. */
export default function ContactPage() {
  const wa = whatsappLink()
  return (
    <div>
      <PageHero
        id="contact-hero"
        crumb="Contact"
        chip="Contact us"
        lines={['Let’s start building', 'your dream home today.']}
        accent={['today.']}
        text="Reach out via phone, WhatsApp, or the form below. Our team responds within 24 hours and a senior architect will call you for a free consultation."
        image="p-completed-2"
        focus="50% 40%"
        pills={['Phone', 'WhatsApp', 'Email', 'Visit us']}
        facts={[{ v: '24h', l: 'Reply time' }, { v: '60 min', l: 'Free consultation' }, { v: company.hours.split(',')[0], l: company.hours.split(',')[1]?.trim() ?? 'Open' }]}
        seal="Contact us • Free consultation •"
        sealTo="contact"
        actions={wa ? <a href={wa} target="_blank" rel="noreferrer" className="btn-primary on-dark">Chat on WhatsApp</a> : undefined}
      />
      <Contact />
    </div>
  )
}
