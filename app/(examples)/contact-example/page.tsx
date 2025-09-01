import ContainerRow from '@/components/layout/ContainerRow';
import SectionBand from '@/components/layout/SectionBand';
import ContactExampleForm from '@/components/examples/ContactExampleForm';

export default function ContactExample() {
  return (
    <main className="z-content">
      <SectionBand>
        <ContainerRow data-reveal>
          <h1 className="text-5xl md:text-6xl font-semibold max-w-full">Contact</h1>
        </ContainerRow>
      </SectionBand>
      <SectionBand>
        <ContainerRow>
          <ContactExampleForm />
        </ContainerRow>
      </SectionBand>
    </main>
  );
}
