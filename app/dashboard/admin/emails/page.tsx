import { redirect } from 'next/navigation';

export default function LegacyAdminEmailsRedirectPage() {
  redirect('/admin');
}
