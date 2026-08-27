import { LegalPage } from "@/components/marketing/legal-page";
import { legalDocuments } from "@/data/legal";
export default function Page() { return <LegalPage document={legalDocuments.terms} />; }
