import HomeClient from './components/HomeClient';
import { cookies } from 'next/headers';
import { getPublicUserById } from '@/lib/db';

export default async function HomePage() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get('session')?.value || 0);
  const user = userId ? (getPublicUserById(userId) ?? null) : null;

  return <HomeClient user={user} />;
}
