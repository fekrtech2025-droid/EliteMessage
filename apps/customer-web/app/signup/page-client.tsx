'use client';

import { AppShell, InfoCard } from '@elite-message/ui';
import { CustomerBrandMark } from '../components/customer-brand-mark';
import { CustomerAuthSurface } from '../components/customer-auth-surface';
import styles from './signup.module.css';

export function CustomerSignupPage() {
  return (
    <AppShell
      title=""
      subtitle=""
      surface="customer"
      contentWidth="narrow"
      headerMode="hidden"
    >
      <div className={styles.stage}>
        <div className={styles.shell}>
          <section className={styles.brandPanel}>
            <div className={styles.brandPlate}>
              <CustomerBrandMark
                alt="Elite Message brand logo."
                width={1024}
                height={1024}
                priority
                sizes="(max-width: 720px) 160px, 192px"
                className={styles.brandImage}
              />
            </div>
            <div className={styles.brandCopy}>
              <p className={styles.eyebrow}>Customer workspace onboarding</p>
              <h1>Open your first Elite Message workspace</h1>
              <p>
                Move from owner signup to customer access, API credentials, and
                runtime visibility inside one branded entry flow.
              </p>
            </div>
          </section>
          <InfoCard
            className={styles.card}
            eyebrow="Customer signup"
            title="Create your account"
            subtitle="Open your first customer workspace with email, password, and owner profile details."
            surface="customer"
          >
            <CustomerAuthSurface initialMode="signup" showToolbar />
          </InfoCard>
        </div>
      </div>
    </AppShell>
  );
}
