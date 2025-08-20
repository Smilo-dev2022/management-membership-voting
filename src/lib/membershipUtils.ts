// Membership utilities for handling 11+ million members
export interface MembershipFee {
  amount: number;
  currency: string;
  minimumAmount: number;
}

export interface MembershipNumber {
  id: string;
  year: number;
  province: string;
  sequential: number;
  formatted: string;
}

// Province codes for South Africa
export const PROVINCE_CODES = {
  'Eastern Cape': 'EC',
  'Free State': 'FS',
  'Gauteng': 'GP',
  'KwaZulu-Natal': 'KZN',
  'Limpopo': 'LP',
  'Mpumalanga': 'MP',
  'Northern Cape': 'NC',
  'North West': 'NW',
  'Western Cape': 'WC'
};

// Membership fee configuration
export const MEMBERSHIP_FEE_CONFIG: MembershipFee = {
  amount: 10, // Default minimum amount
  currency: 'ZAR',
  minimumAmount: 10
};

// Generate membership number for 11+ million capacity
export const generateMembershipNumber = (
  province: string, 
  sequential?: number
): MembershipNumber => {
  const currentYear = new Date().getFullYear();
  const provinceCode = PROVINCE_CODES[province as keyof typeof PROVINCE_CODES] || 'GP';
  
  // Generate sequential number (1 to 99,999,999 - supports 99M+ members per province)
  const sequentialNum = sequential || Math.floor(Math.random() * 99999999) + 1;
  const paddedSequential = sequentialNum.toString().padStart(8, '0');
  
  const formatted = `${currentYear}-${provinceCode}-${paddedSequential}`;
  
  return {
    id: `${currentYear}${provinceCode}${paddedSequential}`,
    year: currentYear,
    province: provinceCode,
    sequential: sequentialNum,
    formatted
  };
};

// Validate membership fee amount
export const validateMembershipFee = (amount: number): boolean => {
  return amount >= MEMBERSHIP_FEE_CONFIG.minimumAmount;
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'ZAR'): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency === 'ZAR' ? 'ZAR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount).replace('ZAR', 'R');
};

// Calculate membership statistics for large numbers
export const formatMemberCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Generate membership fee tiers
export const MEMBERSHIP_TIERS = [
  { label: 'Basic Member', amount: 10, benefits: ['Basic membership', 'Voting rights'] },
  { label: 'Supporting Member', amount: 50, benefits: ['All basic benefits', 'Newsletter', 'Event discounts'] },
  { label: 'Premium Member', amount: 100, benefits: ['All supporting benefits', 'Priority support', 'Exclusive events'] },
  { label: 'Patron Member', amount: 500, benefits: ['All premium benefits', 'Recognition', 'Advisory access'] },
  { label: 'Benefactor', amount: 1000, benefits: ['All patron benefits', 'VIP status', 'Direct leadership access'] }
];

export const getMembershipFeeTiers = () => MEMBERSHIP_TIERS;