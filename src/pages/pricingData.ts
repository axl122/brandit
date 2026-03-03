export type ServiceKey = 'branding' | 'brand_consultation' | 'social_media_management' | 'custom' | 'test_payment'

export type Tier = {
  name: string
  price: string
  items: string[]
}

export type Service = {
  key: ServiceKey
  title: string
  subtitle: string
  tiers: Tier[]
  hasOther?: boolean
}

export const pricingServices: Service[] = [
  {
    key: 'branding',
    title: 'Branding',
    subtitle: 'Visual identity + assets packages',
    tiers: [
      {
        name: 'Tier 1',
        price: '₦12,999',
        items: ['Brand theme / typography', '1 logo (optional)', '2 flyers'],
      },
      {
        name: 'Tier 2',
        price: '₦34,999',
        items: [
          'Brand theme / typography',
          '1 logo (optional)',
          '2 flyers',
          '1 profile banner',
          '1 week content calendar',
          'Portfolio website',
        ],
      },
      {
        name: 'Tier 3',
        price: '₦64,999',
        items: [
          'Brand theme / typography',
          '1 logo (optional)',
          '3 flyers',
          '1 profile banner',
          '1 week content calendar',
          '1 motion graphics',
          'Standard or portfolio website',
        ],
      },
    ],
  },
  {
    key: 'brand_consultation',
    title: 'Brand consultation',
    subtitle: 'Brand auditing + clarity call',
    tiers: [
      { name: 'Tier 1', price: '₦9,999', items: ['25 mins audit call'] },
      { name: 'Tier 2', price: '₦12,999', items: ['35 mins audit call'] },
    ],
  },
  {
    key: 'social_media_management',
    title: 'Social media management',
    subtitle: 'Monthly management package',
    tiers: [
      {
        name: 'Tier 1',
        price: '₦99,999',
        items: [
          'Social media management',
          '1 month',
          'One platform',
          '3 times a week',
          'Graphics design',
          'Video editing',
          'A month content calendar',
          'Page optimization',
        ],
      },
    ],
    hasOther: true,
  },
  {
    key: 'custom',
    title: 'Other / custom',
    subtitle: 'Tell us what you want + your budget',
    tiers: [],
  },
  {
    key: 'test_payment',
    title: 'Test payment',
    subtitle: 'Test Paystack checkout (₦50)',
    tiers: [{ name: 'Test', price: '₦50', items: ['Paystack test transaction'] }],
  },
]
