import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Menandai endpoint yang boleh diakses tanpa token.
 * Guard global menolak semua request tanpa token, kecuali yang
 * memakai decorator ini. Hanya /auth/login yang memakainya.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
