
export interface Bank {
  id: string;
  name: string;
}

export interface BankGroup {
  name: string;
  banks: Bank[];
}


/** list of banks */
export const BANKS: Bank[] = [
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' }, { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },
  { name: 'Audio Failure - 1', id: 'A' },
  { name: 'Audio Failure - 2', id: 'B' },
  { name: 'Burn Stress', id: 'C' },
  { name: 'CD/DVD Issues', id: 'D' },

];

/** list of bank groups */
export const BANKGROUPS: BankGroup[] = [
  {
    name: 'Switzerland',
    banks: [
      { name: 'Bank A', id: 'A' },
      { name: 'Bank B', id: 'B' }
    ]
  },
  {
    name: 'France',
    banks: [
      { name: 'Bank C', id: 'C' },
      { name: 'Bank D', id: 'D' },
      { name: 'Bank E', id: 'E' },
    ]
  },
  {
    name: 'Italy',
    banks: [
      { name: 'Bank F', id: 'F' },
      { name: 'Bank G', id: 'G' },
      { name: 'Bank H', id: 'H' },
      { name: 'Bank I', id: 'I' },
      { name: 'Bank J', id: 'J' },
    ]
  },
  {
    name: 'United States of America',
    banks: [
      { name: 'Bank Kolombia', id: 'K' },
    ]
  },
  {
    name: 'Germany',
    banks: [
      { name: 'Bank L', id: 'L' },
      { name: 'Bank M', id: 'M' },
      { name: 'Bank N', id: 'N' },
      { name: 'Bank O', id: 'O' },
      { name: 'Bank P', id: 'P' },
      { name: 'Bank Q', id: 'Q' },
      { name: 'Bank R', id: 'R' }
    ]
  }
];
